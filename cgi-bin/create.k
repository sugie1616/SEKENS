#!/usr/local/bin/konoha

/*
 * create.k - create a new git repository
 *
 * @protocol POST
 * @param cookie['SID']		sid
 * @param title				title of new repository
 * @param desc				description of new repository
 * @return json['result']	result message
 * @return json['error']	error message
 */

include "SEKENS.k";
include "git.k";

DEBUG=false;

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
		OUT << SEKENS.err2json("Parameter 'title' is not given.") << EOL;
		return;
	}

	String repo_desc = cgi.params["desc"];
	if (repo_desc == null) {
		OUT << SEKENS.err2json("Parameter 'desc' is not given.") << EOL;
		return;
	}

	String sid = cgi.cookies["SID"]["val"];
	if (sid == null) {
		OUT << SEKENS.err2json("sid is not found") << EOL;
		return;
	}

	Json j = SEKENS.checkSID(sid);
	String username = j["username"];
	if (username == null) {
		OUT << SEKENS.err2json("username is not found") << EOL;
		return;
	}

	String user_dir = G_USER_DIR + username + "/";

	String create_dir = user_dir + repo_title + "/";
	if (mkdir(create_dir, 0775) == false) {
		OUT << SEKENS.err2json("mkdir '" + create_dir + "' failed") << EOL;
		return;
	}

	String create_gitdir = create_dir + ".git";
	if (mkdir(create_gitdir, 0775) == false) {
		OUT << SEKENS.err2json("mkdir '" + create_gitdir + "' failed") << EOL;
		return;
	}

	Git git = new Git(create_gitdir);
	git.init();

	j = new Json();
	j["result"] = "create repository successed";
	OUT << j.stringify() << EOL;
}
