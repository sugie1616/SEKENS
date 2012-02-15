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

void outputTree(Map[] tree)
{
	for (int i = 0; i < tree.size; i++) {
		Map node = tree[i];
		OUT.println("		{");
		OUT.println("			\"name\": \"" + node["name"] + "\",");
		OUT.println("			\"children\": [");
		String[] children = node["children"];
		for (int j = 0; j < children.size; j++) {
			String e = children[j];
			OUT.println("				{");
			OUT.println("					\"name\": \"" + e + "\",");
			OUT.println("					\"leaf\": true");
			//OUT.println("				}");
			if (j < children.size - 1) {
				OUT.println("				},");
			} else {
				OUT.println("				}");
			}
		}
		OUT.println("			]");
		if (i < tree.size - 1) {
			OUT.println("		},");
		} else {
			OUT.print("		}");
		}
	}
}

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

	String[] teacher_repos = exec("ls " + G_GIT_DIR).split("\n");
	teacher_repos.pop();

	Map teacher_tree = {};
	teacher_tree["name"] = "teacher";
	teacher_tree["children"] = teacher_repos;
	//foreach (String repo in teacher_repos) {
		//Map m = {};
		//m["name"] = repo;
		//String[] files = exec("ls " + G_GIT_DIR + repo).split("\n");
		//files.pop();
		//m["children"] = files;
		//teacher_tree.add(m);
	//}

	Map[] tree = [];
	foreach (String repo in git_repos) {
		if (repo == "Repository") continue;
		Map m = {};
		m["name"] = repo;
		String repo_dir = user_dir + repo + "/";
		String[] files = exec("ls " + repo_dir).split("\n");
		files.pop();
		m["children"] = files;
		tree.add(m);
	}

	OUT.println("[");
	//OUT.println("	{");
	//OUT.println("		\"name\": \"teacher\",");
	//OUT.println("		\"children\": [");
	outputTree([teacher_tree]);
	//OUT.println("]");
	//OUT.println("	},{");
	OUT.println(",{");
	OUT.println("		\"name\": \"" + username + "\",");
	OUT.println("		\"children\": [");
	outputTree(tree);
	OUT.println();
	OUT.println("		]");
	OUT.println("	}");
	OUT.println("]");
}
