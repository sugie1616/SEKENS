#!/usr/local/bin/konoha

include "SEKENS.k";

PRE_JS = """
<script type="text/javascript">
<!--
"""
POST_JS = """
-->
</script>
"""

void main()
{
	SEKENS sekens = new SEKENS();
	String html = sekens.html;
	Cgi cgi = new Cgi();
	String jscode = "";
	if (cgi.cookies["SID"] != null) {
		String sid = cgi.cookies["SID"]["val"];
		Json j = sekens.checkSID(sid);
		if (j != null) {
			String username = j["username"];
			/* [TODO] how to user username? */
			html = html.replace("%script%", "main.js");
			jscode = "var userName = '" + username + "';\n";
		}
		else {
			OUT << sekens.deleteCookie("SID");
			html = html.replace("%script%", "top.js");
		}
	}
	else {
		html = html.replace("%script%", "top.js");
	}
	jscode += "var homeURL = '" + G_HOME_URL + "';\n";
	html = html.replace("%jscode%", PRE_JS + jscode + POST_JS);

	OUT << "Content-Type: text/html\n" << EOL;
	OUT << html;
	OUT.flush();
}
