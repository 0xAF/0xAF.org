/*
 * PC Speaker beeper.
 * Copyright (c) 2006 Stanislav Lechev [AngelFire].
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * there is 2 ways to compile:
 * gcc -DUSE_DEV_TTY beep.c -o beep
 * or
 * gcc -DUSE_DEV_CONSOLE beep.c -o beep
 *
 * USE_DEV_CONSOLE if you want to use the program in RC/CRONTAB/etc. scripts which dont have opened console.
 * this will require root access (depends on permisions of /dev/console)
 * 
 * USE_DEV_TTY if you want to use /dev/tty (which will allow using the program by users)
 *
 * or just compile the both versions ;]
 *
 */ 

#include <stdio.h>
#include <unistd.h>

#define reset_speaker fprintf(console, "\033[10;750]\033[11;100]");

#ifndef USE_DEV_CONSOLE
  #ifndef USE_DEV_TTY
    #error please see the comments in the source how to compile.
  #endif
#else
  #ifdef USE_DEV_TTY
    #error you cannot use TTY and CONSOLE together. see the comments in the source.
  #endif
#endif

int main ( int argc, char ** argv ) {
	if (argc < 2) {
		printf("PC Speaker beeper.\n");
		printf("Copyright (c) 2006. Stanislav Lechev [AngelFire].\n");
		printf("You can use this program by the terms of GNU Public License v2.\n\n");
		printf("usage:\n\t    %s Khz/msecs [hz/msecs]\n", argv[0]);
		printf("\tex: %s 500/100 750/100 1000/100\n", argv[0]);
		exit(1);
	}

	FILE * console;
#ifdef USE_DEV_CONSOLE
	console = fopen("/dev/console", "w");
#elif USE_DEV_TTY
	console = fopen("/dev/tty", "w");
#else
  #error see comments in the source how to compile
#endif
	if (console == NULL) {
		perror("fopen");
		exit(1);
	}

	int i;
	for (i=1; i<argc; i++) {
		int mhz,msec;
		if (sscanf(argv[i], "%d/%d", &mhz, &msec) != 2) {
			fprintf(stderr, "unparsable argument [%d]: %s\n",
					i, argv[i]);
			reset_speaker;
			fclose(console);
			exit(1);
		}
		
		fprintf(console, "\033[10;%d]\033[11;%d]\a",
				mhz, msec);
		fflush(console);
		usleep(msec * 1000);
	}

	reset_speaker;
	fclose(console);
	return 0;
}

