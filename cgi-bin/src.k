#!/usr/local/bin/konoha

OUT << "Content-Type: text/plain" << EOL << EOL;

String query = $env.QUERY_STRING;
//------ Run Src ---------
//String decodeToKonoha(String query) {
//	String[] map = query.split("&");
//	String str = map[1];
//	str = str.replace("%22", "\"");
//	str = str.replace("%20", " ");
//	str = str.replace("%3C", "<");
//	str = str.replace("%3E", ">");
//	return str;
//}
//
//void outputResult(String kScript) {
////	String result = eval(kScript);
//	String result = kScript;
//	OUT << result << EOL;
//}
//Bytes b = new byte[$env.CONTENT_LENGTH];
//IN.read(b, 0, |b|);
//print b.decode();
print IN.readLine();
print IN.readLine();
print IN.readLine();
print IN.readLine();
while (script != null) {
	print i++;
	OUT << script << EOL;
	script = IN.readLine();
}
print i;
//outputResult(decodeToKonoha(query));




//------ Save Src ------------
void saveSrc() {
/*
use git cmd
commit&push the user's editing src
*/
}

//------ Load Src ------------
String loadSrc() {
/*
use git cmd
and konoha script
*/
	return src;
}

//------ Fork Src From Friend -------
void forkSrc() {
/*
use git cmd
clone the friend's src
*/
}

//------ Other Work About Src... -----
/*
use git,konoha,etc...
*/
