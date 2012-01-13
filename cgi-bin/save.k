#!/usr/local/bin/konoha

using konoha.libgit2.*;
using konoha.conv.*;

OUT << "Content-Type: text/plain" << EOL << EOL;
//String editFileName = readLine().replace("input=", "");
//OutputStream out = new OutputStream("./uSrcs/" + editFileName);

OutputStream out = new OutputStream("./uSrcs/test.k");
String script;
script = readLine().replace("input=", "");
script = script.convert(to:durl);
print script;
out.print(script);
out.flush();


