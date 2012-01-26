#!/usr/local/bin/konoha

/*
 * list.k - list all of user repositories
 *
 * @protocol GET
 * @param user				username
 * @return json['result']	result message
 * @return json['error']	error message
 * @return json['list']		list of git repositories
 */

using konoha.json.*;
using konoha.posix.*;
include "settings.k";
include "cgi.k";
include "SEKENS.k";

DEBUG=false;

String err2json(String errtxt)
{
	Json j = new Json();
	j["error"] = errtxt;
	return j.stringify();
}

void main(String[] args)
{
	if (DEBUG) {
		OUT << "Content-Type: text/plain\n" << EOL;
	} else {
		OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	}

	Cgi cgi = new Cgi();

	String username = cgi.params["user"];
	if (username == null) {
		OUT << err2json("Parameter 'user' is not given.") << EOL;
		return;
	}

	String user_dir = G_USER_DIR + username + "/";

	String[] git_repos = exec("ls " + user_dir).split("\n");
	git_repos.pop();

	Json j = new Json();
	j["result"] = "get list successed";
	j["list"] = git_repos;
	OUT << j.stringify() << EOL;
}
