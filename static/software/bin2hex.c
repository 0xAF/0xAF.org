#include <stdio.h>

int main( int argc, const char * argv [] )
{
    const char * varname = argv[1];
    int i = 0;
    int c;

    printf( "/* automatically generated by bin2hex */\n" );
    printf( "static unsigned char %s [] =\n{\n", varname );

    while ( ( c = getchar( ) ) != EOF ) {
        if ( i != 0 && i % 10 == 0 )
            printf( "\n" );
        printf( "0x%02lx,", c & 0xFFl );
        i++;
    }

    printf( "};\n#define %s_len %d\n", varname, i );
    return 0;
}

