#!/usr/local/bin/konoha

using konoha.libgit2.*;
using konoha.conv.*;

OUT << "Content-Type: text/plain" << EOL << EOL;

InputStream ins = new InputStream("./uSrcs/test2.k");
foreach (String str in ins) {
	OUT << str << EOL;
}

