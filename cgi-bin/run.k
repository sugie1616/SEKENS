#!/usr/local/bin/konoha

using konoha.conv.*;
using konoha.io.*;

OUT << "Content-Type: text/plain" << EOL << EOL;
//content_length = (to Int)$env.CONTENT_LENGTH;
//print content_length;
//buf = new byte[content_length];
//IN.read(buf, 0, content_length);
//script = buf.decode();
//
//for (i = 0; i < content_length; i++) {
//	print buf[i];
//}
//
String script;// = IN.readLine();
String script = readLine().replace("input=", "");
script = script.convert(to:durl);
eval(script);
