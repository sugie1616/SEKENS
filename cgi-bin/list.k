#!/usr/local/bin/konoha

/*
 * list.k - list all of user repositories
 *
 * @protocol GET
 * @param cookie['SID']		sid
 * @return array[map]		directory tree
 */

include "SEKENS.k";

DEBUG=false;

void main(String[] args)
{
	if (DEBUG) {
		OUT << "Content-Type: text/plain\n" << EOL;
	} else {
		OUT << "Content-Type: application/json;charset=UTF-8\n" << EOL;
	}

	Cgi cgi = new Cgi();

	String sid = cgi.cookies["SID"]["val"];
	Json j = SEKENS.checkSID(sid);
	if (j == null) {
		OUT << SEKENS.err2json("sid is incorrect") << EOL;
		return;
	}

	String username = j["username"];
	String user_dir = G_USER_DIR + username + "/";

	String[] git_repos = exec("ls " + user_dir).split("\n");
	git_repos.pop();

	Map[] tree = [];
	foreach (String repo in git_repos) {
		Map m = {};
		m["name"] = repo;
		String repo_dir = user_dir + repo + "/";
		String[] files = exec("ls " + repo_dir).split("\n");
		files.pop();
		m["children"] = files;
		tree.add(m);
	}

	OUT.println("[");
	foreach (Map node in tree) {
		OUT.println("	{");
		OUT.println("		\"name\": \"" + node["name"] + "\",");
		OUT.println("		\"children\": [");
		String[] children = node["children"];
		foreach (String e in children) {
			OUT.println("			{");
			OUT.println("				\"name\": \"" + e + "\",");
			OUT.println("				\"leaf\": true");
			OUT.println("			},");
		}
		OUT.println("		]");
		OUT.println("	},");
	}
	OUT.println("]");
}
