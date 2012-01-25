#!/usr/local/bin/konoha

using konoha.libgit2.*;
using konoha.conv.*;

OUT << "Content-Type: text/plain" << EOL << EOL;
String str,script,userName;
String src_file = "../resources/uSrcs/sugimoto/test.k";
str = readLine().replace("input=", "");
userName = "sugimoto";
script = str;
OutputStream out = new OutputStream(src_file);
script = script.convert(to:durl);
print script;
out.print(script);
out.flush();
