#!/usr/local/bin/konoha

/*
 * push & commit script
 *
 * @protocol POST
 * @param sid
 * @param name
 * @param script
 * @return json['result']
 * @return json['error']
 */

using konoha.conv.*;
using konoha.json.*;
using konoha.posix.*;

DEBUG=false;

GIT_DIR="/Users/chen_ji/Devel/git/SEKENS.codes/.git";
HOME_DIR="/Users/chen_ji/Devel/git/SEKENS.codes/";
TMP_DIR="/tmp/";
GIT_CMD="/usr/bin/git --git-dir=" + GIT_DIR;

void printError(String errtxt) {
	Json j = new Json();
	j["error"] = errtxt;
	OUT << j.stringify() << EOL;
}

void saveScript(String script_name, String script_body)
{
	if (DEBUG) {
		print "save " + script_name;
	}
	OutputStream ous = new OutputStream(TMP_DIR + script_name);
	if (ous == null) {
		printError("Parameter 'name' is incorrect.");
		return;
	}
	ous << script_body;
	ous.flush();
	ous.close();
}

boolean pushScript(Path script_path)
{
	if (DEBUG) {
		print "push " + script_path;
		OUT << exec("cd " + HOME_DIR + "&&" + GIT_CMD + " status");
	}

	exec(GIT_CMD + " add " + script_path);

	if (exec("cd " + HOME_DIR + " && " + GIT_CMD + " diff") != "") {
		exec(GIT_CMD + " commit -m \"automatically committed\"");
		exec(GIT_CMD + " push");
	} else {
		return false;
	}
	return true;
}

void main(String[] args)
{
	if (DEBUG) {
		OUT << "Content-Type: text/plain\n" << EOL;
	} else {
		OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	}

	String input = System.readLine().convert(to:durl);

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

	String script_body = params["script"];
	if (script_body == null) {
		printError("Parameter 'script' is not given.");
		return;
	}

	saveScript(script_name, script_body);
	Json j = new Json();
	if (pushScript(TMP_DIR + script_name)) {
		j["result"] = "Push successed.";
	} else {
		j["result"] = "No need to push.";
	}
	OUT << j.stringify() << EOL;
}
