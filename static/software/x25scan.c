/*
 * (c) Jul.2000 AngelFire / [LmT]
 *
 * Greetz: all members of [LmT]
 *         and all my friendz that makes me happy of this shitty world.
 *
 * PLEASE DISTRIBUTE (sick of PRIVATE shitz!)
 *
 * Some code is of course stolen from its rightful owners.
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <netinet/in.h>
#include <netdb.h>
#include <unistd.h>
#include <arpa/inet.h>
//#define DEBUG

char usage[] = "usage: x25scan -h <host> -p <port> -f <file> -c nuafile\n"
               "-h <host> : some x25 pad\n"
               "-p <port> : port to connect to\n"
               "-f <file> : file to log\n"
               "-c        : log to console only... (disable log file)\n"
               "nuafile   : file with nua's to scan (each on newline)\n";

char recvbuf[BUFSIZ], sendbuf[BUFSIZ], xpad[BUFSIZ], logf[BUFSIZ];

FILE *cin, *cout, *logfile, *nuafile;

int timeout, response = 1, seconds = 0, minute = 0, port, fd;


int logit( const char *fmt, ...) {

    va_list args;

    va_start(args, fmt);
#ifdef DEBUG
    vfprintf(stderr, fmt, args);
#endif
    va_end(args);

    return 0;
}

char *get_time( void ) {

    char *tim;
    time_t t;

    time(&t);
    tim=ctime(&t);
    tim[strlen(tim)-9]=0;
    strtok(tim," ");

    return strtok('\0', "\0");
}


long getip( char *name ) {

    struct hostent *hp;
    long ip;
    extern int h_errno;

    if ((ip = inet_addr(name)) < 0) {
        if (!(hp = gethostbyname(name))) {
            fprintf(stderr, "gethostbyname(): %s\n", strerror(h_errno));
            exit(1);
        }

        memcpy(&ip, (hp->h_addr), 4);
    }

    return ip;
}

int connecthost( char *host, int port) {

    int sockfd;
    struct sockaddr_in cli;

    bzero(&cli, sizeof(cli));
    cli.sin_family = AF_INET;
    cli.sin_addr.s_addr=getip(host);
    cli.sin_port = htons(port);

    logit("Connecting to %s... ", xpad);

    if((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        perror("socket");
        return -1;
    }

    if(connect(sockfd, (struct sockaddr *)&cli, sizeof(cli)) < 0) {
        perror("connect");
        close(sockfd);
        return -1;
    }

    cin = fdopen(sockfd, "r");
    cout = fdopen(sockfd, "w");

    if (!cin || !cout) {
        close(sockfd);
        return -1;
    }

    logit("Connected.\nSending 2xCR. just in case...\n");

    sleep(3);
    (void)fputs("\r\n\r\n",cout);
    (void)fflush(cout);

    return sockfd;
}

int disconnecthost( int sock ) {

    logit("Disconnecting from %s...", xpad);

    close(sock);

    logit("Disconnected.\n");

    return 0;
}

int command( const char *cmd ) {

    if (!cout)
            return -1;

    fprintf(cout, cmd);

    logit(">S> %s\n",cmd);

    fputs("\r\n", cout);
    (void)fflush(cout);

    return 0;
}



int alarmhandler( int signum ) {

    if ( response == 0 ) {

        seconds += 2;
        minute += 2;

        logit("seconds:%d minute:%d ",seconds,minute);

        if ( seconds > timeout ) {

            logit("... sending CR\n");
            fprintf(cout, "\r\n");
            fflush(cout);

            seconds = 0;
            alarm(2);

            return 0;

        } else {

            if ( minute > 20 ) {

                logit("... reconnecting\n");

                disconnecthost(fd);
                sleep(2);

                if ((fd = connecthost(xpad, port)) < 0) {
                    logit("Connection to %s failed.\n", xpad);
                    exit(1);
                }

                seconds = minute = 0;
                response = 1;

                alarm(0);

//              doscan;
                logit("scaning...\n");

                return 0;

            }

            logit("... setting new alarm\n");
            alarm(2);

            return 0;

        }

    } else {

        return 0;

    }

}


int getreply( void ) {

    response = 0;
    seconds = 0;

    alarm(2);

    if (!(fgets(recvbuf, BUFSIZ, cin)))
                    return -1;

    response = 1;

    logit("<R< %s", recvbuf);

    return 0;

}

int doscan( void ) {

//    command("SITE EXEC %p");

//    repl;

//    if(strncmp(recvbuf, "200-", 4))
//                    return -1;

//    if(strncmp(recvbuf+4, "0x", 2))
//                  return -1;

//        repl;

    return 0;

}


int main( int argc, char **argv ) {

    extern int optind, opterr;
    extern char *optarg;
    int ch;

    opterr = 0;
    timeout = 6;
    port = 23;

    strcpy(xpad, "x25pad.autonet.net");
    strcpy(logf, "x25log");


    signal(SIGALRM, alarmhandler);

    while ((ch = getopt(argc, argv, "h:f:p:c")) != -1)
        switch((char)ch) {
            case 'h':
                strcpy(xpad, optarg);
                break;

            case 'c':
                #define DEBUG
                break;

            case 'p':
                port = atoi(optarg);
                break;

            case 'f':
                strcpy(logf, optarg);
                break;

            case '?':
            default:
                puts(usage);
                exit(0);
        }

    argc -= optind;
    argv += optind;

    logit("Current settings:\n"
          "x25pad: %s\n"
          "port: %d\n"
          "log file: %s\n"
          "nua's file: %s\n\n",
          xpad, port, logf, *argv);

//    printf("%s\n",get_time());

    if (argc != 1) {
        puts(usage);
        exit(0);
    }

    if ((logfile = fopen(logf,"a")) == NULL) {
        logit("cannot open/create log file %s.\nuse -c option.\nTerminating...\n", logf);
        exit(1);
    }


    if ((fd = connecthost(xpad, port)) < 0) {
        logit("Connection to %s failed.\n", xpad);
        exit(1);
    }

    if (doscan() < 0) {
        logit("error reading nuafile: %s.\nTerminating...\n",*argv);
        exit(1);
    }

    if (exitproggie() < 0) {
        logit("error !!!\n");
        exit(1);
    }

/* NOT REACHED */

    return 0;
}

