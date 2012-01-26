#!/usr/local/bin/konoha

/*
 * load script
 *
 * @protocol GET
 * @param sid
 * @param name
 * @return json['error']
 * @return json['result']
 * @return json['script']
 */

using konoha.conv.*;
using konoha.posix.*;

include "SEKENS.k";

DEBUG=false;

HOME_DIR="/Users/chen_ji/Devel/git/SEKENS.codes/";

void printError(String errtxt) {
	Json j = new Json();
	j["error"] = errtxt;
	OUT << j.stringify() << EOL;
}

String loadScript(Path script_path)
{
	if (DEBUG) {
		OUT << "load " + script_path << EOL;
	}
	InputStream ins = new InputStream(script_path);
	String script = "";
	foreach (String line in ins) {
		script += line + EOL;
	}
	if (script == "") {
		printError("No such script.");
	}
	return script;
}

void main(String[] args)
{
	if (DEBUG) {
		OUT << "Content-Type: text/plain\n" << EOL;
	} else {
		OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	}

	String input = ($env.QUERY_STRING).convert(to:durl);

	Map<String> params = {};
	foreach (String param in input.split("&")) {
		String[] k_v = param.split("=");
		params[k_v[0]] = k_v[1];
	}

	String script_name = params["name"];
	if (script_name == null) {
		printError("Parameter 'name' is not given.");
		return;
	}

	String script = loadScript(HOME_DIR + script_name);
	if (script != "") {
		Json j = new Json();
		j["result"] = "Load Successed.";
		j["script"] = script;
		OUT << j.stringify() << EOL;
	}
}
