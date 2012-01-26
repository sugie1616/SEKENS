#!/usr/local/bin/konoha

/*
 * create.k - create a new git repository
 *
 * @protocol POST
 * @param sid				sid
 * @param title				title of new repository
 * @param desc				description of new repository
 * @return json['result']	result message
 * @return json['error']	error message
 */

using konoha.json.*;
using konoha.posix.*;
include "settings.k";
include "cgi.k";
include "git.k";

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

	String repo_title = cgi.params["title"];
	if (repo_title == null) {
		OUT << err2json("Parameter 'title' is not given.") << EOL;
		return;
	}

	String repo_desc = cgi.params["desc"];
	if (repo_desc == null) {
		OUT << err2json("Parameter 'desc' is not given.") << EOL;
		return;
	}

	String user_dir = G_USER_DIR + "chen_ji" + "/";

	String create_dir = user_dir + repo_title + "/";
	if (mkdir(create_dir, 0755) == false) {
		OUT << err2json("mkdir '" + create_dir + "' failed") << EOL;
		return;
	}

	String create_gitdir = create_dir + ".git";
	if (mkdir(create_gitdir, 0755) == false) {
		OUT << err2json("mkdir '" + create_gitdir + "' failed") << EOL;
		return;
	}

	Git git = new Git(create_gitdir);
	git.init();

	Json j = new Json();
	j["result"] = "create repository successed";
	OUT << j.stringify() << EOL;
}
