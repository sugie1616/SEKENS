#!/usr/local/bin/konoha

using konoha.libgit2.*;
using konoha.conv.*;

OUT << "Content-Type: text/plain" << EOL << EOL;
String str,script,userName;
str = readLine().replace("input=", "");
userName = "sugimoto";
script = str;
OutputStream out = new OutputStream("./uSrcs/sugimoto/test.k");
script = script.convert(to:durl);
print script;
out.print(script);
out.flush();
