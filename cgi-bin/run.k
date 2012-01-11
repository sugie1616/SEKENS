#!/usr/local/bin/konoha

OUT << "Content-Type: text/plain" << EOL << EOL;

String query = $env.QUERY_STRING;
print env.QUERY_STRING;

String decodeToKonoha(String query) {
	String[] map = query.split("&");
	String str = map[1];
	str = str.replace("%22", "\"");
	str = str.replace("%20", " ");
	str = str.replace("%3C", "<");
	str = str.replace("%3E", ">");
	return str;
}

void outputResult(String kScript) {
//	String result = eval(kScript);
	String result = kScript;
	OUT << result << EOL;
}
//Bytes b = new byte[$env.CONTENT_LENGTH];
//IN.read(b, 0, |b|);
//print b.decode();
int content_length = (to int)$env.CONTENT_LENGTH;
while (true) {
	String script = IN.readLine();
	content_length -= |script|;
	if (content_length == 0) break;
	print i++;
	OUT << script << EOL;
}
print i;
//outputResult(decodeToKonoha(query));
