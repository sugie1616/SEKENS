#!/usr/local/bin/konoha

using konoha.conv.*;
using konoha.io.*;

OUT << "Content-Type: text/plain" << EOL << EOL;

class Run
{
	String srcDir = "../resources/uSrcs/sugimoto/test.k";
	String newCode,oldCode;

	Run() {
		_newCode = readLine().replace("input=", "");
		_newCode = newCode.convert(to:durl);
		InputStream ins = new InputStream(srcDir);
		foreach (String str in ins) {
			_oldCode += str + "\n";
		}
		print oldCode;
		print newCode;
	}
	
	boolean checkUpdateSrc() {
		boolean updateSrc = false;//true = updated
		if (newCode == oldCode) {
			print "code is NOT changed";
			//OUT << exec("/usr/local/bin/konohac --emit-js" + " " + srcDir) << EOL;
		}
		else {
			print "code is changed";
			updateSrc = true;
		}
		return updateSrc;
	}
	
	void evalKonoha(boolean updateSrc) {
		if (updateSrc == true) {
			OutputStream out = new OutputStream("./uSrcs/sugimoto/newTest.k");
			out.print(newCode);
			out.flush();
			//OUT << exec("/usr/local/bin/konohac --emit-js" + " " + "./uSrcs/sugimoto/newTest.k") << EOL;
		}
	}

}

void main() {
	Run run = new Run();
	run.evalKonoha(run.checkUpdateSrc());
}
