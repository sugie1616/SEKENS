#!/usr/local/bin/konoha

using konoha.libgit2.*;
using konoha.conv.*;

OUT << "Content-Type: text/plain" << EOL << EOL;
//String editFileName = readLine().replace("input=", "");
//OutputStream out = new OutputStream("./uSrcs/" + editFileName);

String str,script,userName;
str = readLine().replace("input=", "");
userName = str.split("!!!")[0];
script = str.split("!!!")[1];
OutputStream out = new OutputStream("./uSrcs/" + userName + "/test.k");
//exec("git add uSrc/" + userName + "/test.k");
//exec("git commit -m "aaa"");
//exec("git push");
script = script.convert(to:durl);
print script;
out.print(script);
out.flush();

//aaa
//
