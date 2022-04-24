const whoisRoot = "I am Groot.";
let repos;
// github_project(),
(async()=>{
  repos = await github_project()
})();
const commands = {
  help: function() {
    const maxCmdLength = Math.max(...Object.keys(help).map(x => x.length));
    Object.entries(help).forEach(function(kv) {
      const cmd = kv[0];
      const desc = kv[1];
      if (term.cols >= 80) {
        const rightPad = maxCmdLength - cmd.length + 2;
        const sep = " ".repeat(rightPad);
        term.stylePrint(`${cmd}${sep}${desc}`);
      } else {
        if (cmd != 'help') { // skip second leading newline
          term.writeln("");
        }
        term.stylePrint(cmd);
        term.stylePrint(desc);
      }
    })
  },

  whois: function(args) {
    const name = args[0];
    const people = Object.keys(team);

    if (!name) {
      term.stylePrint("%whois%: Learn about me:\r\n");
      term.stylePrint("%whois% root");
      for (p of people) {
        term.stylePrint(`%whois% ${p}`);
      }
    } else if (name == "root") {
      const description = whoisRoot;
      console.log('tori')
      term.printArt('root');
      term.stylePrint(description);
    } else if (Object.keys(team).includes(name.toLowerCase())) {
      
      const person = team[name.toLowerCase()];
      term.printArt(name.toLowerCase());
      term.stylePrint(`\r\n${person["name"]}, ${person["title"]} - ${person['email']}`);
      term.stylePrint(`${person["linkedin"]}\r\n`);
      term.stylePrint(person["description"]);
    } else {
      term.stylePrint(`User ${name || ''} not found. Try:\r\n`);
      term.stylePrint("%whois% root");
      for (p of people) {
        term.stylePrint(`%whois% ${p}`);
      }
    }
  },


  git: function() {
    term.displayURL("https://github.com/Th4p4/xterm-portfolio.git");
  },

 

  email: function() {
    term.command("pine");
  },

  github: function() {
    term.displayURL("https://github.com/Th4p4");
  },

  instagram: function() {
    term.displayURL("https://www.instagram.com/sandp_thapa5/");
  },

  insta: function() {
    term.command("instagram");
  },

  other: function() {
    term.stylePrint("Yeah, I didn't literally mean %other%. I mean try some Linux commands");
  },

  echo: function(args) {
    const message = args.join(" ");
    term.stylePrint(message);
  },

  say: function(args) {
    const message = args.join(" ");
    term.stylePrint(`(Robot voice): ${message}`);
  },

  pwd: function() {
    term.stylePrint("/" + term.cwd.replaceAll("~", `home/${term.user}`));
  },

  ls: function() {
    term.stylePrint(_filesHere().join("   "));
  },

  // I am so, so sorry for this code.
  cd: function(args) {
    let dir = args[0] || "~";
    if (dir != "/") {
      // strip trailing slash
      dir = dir.replace(/\/$/, "");
    }
    
    switch(dir) {
      case "~":
        term.cwd = "~";
        break;
      case "..":
        if (term.cwd == "~") {
          term.command("cd /home");
        } else if (["home", "bin"].includes(term.cwd)) {
          term.command("cd /");
        }
        break;
      case "../..":
      case "../../..":
      case "../../../..":
      case "/":
        term.cwd = "/";
        break;
      case "home":
        if (term.cwd == "/") {
          term.command("cd /home");
        } else {
          term.stylePrint(`You do not have permission to access this directory`);
        }
        break;
      case "/home":
        term.cwd = "home";
        break;
      case "guest":
      case "root":
        if (term.cwd == "home") {
          if (term.user == dir) {
            term.command("cd ~");
          } else {
            term.stylePrint(`You do not have permission to access this directory`);
          }
        } else {
          term.stylePrint(`No such directory: ${dir}`);
        }
        break;
      case "../home/sandip":
        if (term.cwd == "~" || term.cwd == "bin") {
          term.command(`cd ${dir.split("/")[2]}`);
        } else {
          term.stylePrint(`No such directory: ${dir}`);
        }
        break;
      case "/home/sandip":
      case "sandip":
        term.stylePrint(`You do not have permission to access this directory`);
        break;
      case "/bin":
        term.cwd = "bin";
        break;
      case "bin":
        if (term.cwd == "/") {
          term.cwd = "bin";
        } else {
          term.stylePrint(`No such directory: ${dir}`);
        }
        break;
      case ".":
        break;
      default:
        term.stylePrint(`No such directory: ${dir}`);
        break;
    }
  },

  zsh: function() {
    term.init(term.user);
  },

  cat: function(args) {
    const filename = args[0];

    if (_filesHere().includes(filename)) {
      term.writeln(getFileContents(filename));
    } else {
      term.stylePrint(`No such file: ${filename}`);
    }
    if (filename == "id_rsa") {
      term.openURL("https://gfycat.com/ifr/WhiteBountifulAfricangroundhornbill");
    }
  },

  grep: function(args) {
    const q = args[0];
    const filename = args[1];

    if (filename == "id_rsa") {
      term.openURL("https://gfycat.com/ifr/WhiteBountifulAfricangroundhornbill");
    }
    
    if (!q || !filename) {
      term.stylePrint("usage: %grep% [pattern] [filename]");
      return;
    }

    if (_filesHere().includes(filename)) {
      var file = getFileContents(filename);
      const matches = file.matchAll(q);
      for (match of matches) {
        file = file.replaceAll(match[0], colorText(match[0], "files"));
      } 
      term.writeln(file);
    } else {
      term.stylePrint(`No such file or directory: ${filename}`);
    }
  },

  finger: function(args) {
    const user = args[0];

    switch(user) {
      case 'guest':
        term.stylePrint("Login: guest            Name: Guest");
        term.stylePrint("Directory: /home/guest  Shell: /bin/zsh");
        break;
      case 'root':
        term.stylePrint("Login: root             Name: That's Us!");
        term.stylePrint("Directory: /home/root   Shell: /bin/zsh");
        break;
      case 'sandip':
    
        term.stylePrint(`Login: ${user}   Name: ${team[user]["name"]}`);
        term.stylePrint(`Directory: /home/${user}   Shell: /bin/zsh`);
        break;
      default:
        term.stylePrint(user ? `%finger%: ${user}: no such user` : "usage: %finger% [user]");
        break;
    }
  },

  groups: function(args) {
    const user = args[0];

    switch(user) {
  
      case 'root':
        term.stylePrint("I am Groot.");
        break;
      
      case 'sandip':
        term.stylePrint("Default:");
        
      default:
        term.stylePrint(user ? `%groups%: ${user}: no such user` : "usage: %groups% [user]");
        break;
    }
  },

  gzip: function() {
    term.stylePrint("What are you going to do with a zip file on a fake terminal, seriously?");
  },

  free: function() {
    term.stylePrint("Honestly, our memory isn't what it used to be");
  },

  tail: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  less: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  head: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  open: function(args) {
    if (args[0].split(".")[1] == "htm") {
      term.openURL(`./${args[0]}`, false);
    } else {
      term.command(`cat ${args.join(" ")}`);
    }
  },

  more: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  emacs: function() {
    term.stylePrint("%emacs% not installed. try: %vi%");
  },

  vim: function() {
    term.stylePrint("%vim% not installed. try: %emacs%");
  },

  vi: function() {
    term.stylePrint("%vi% not installed. try: %emacs%");
  },

  pico: function() {
    term.stylePrint("%pico% not installed. try: %vi% or %emacs%");
  },

  nano: function() {
    term.stylePrint("%nano% not installed. try: %vi% or %emacs%");
  },

  pine: function() {
    term.openURL(`mailto:Sandeep407205@gmail.com`);
  },

  curl: function(args) {
    term.stylePrint(`Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource ${args[0]}.`);
  },

  ftp: function(args) {
    term.command(`curl ${args.join(" ")}`);
  },

  ssh: function(args) {
    term.command(`curl ${args.join(" ")}`);
  },

  sftp: function(args) {
    term.command(`curl ${args.join(" ")}`);
  },

  scp: function(args) {
    term.stylePrint(`████████████ Request Blocked: The ███████████ Policy disallows reading the ██████ resource ${args[0]}.`);
  },

  rm: function() {
    term.stylePrint("I can't let you do that, Dave");
  },

  mkdir: function() {
    term.stylePrint("Come on, don't mess with our immaculate file system");
  },

  alias: function() {
    term.stylePrint("Just call me HAL");
  },

  df: function() {
    term.stylePrint("Nice try. Just get a Dropbox");
  },

  kill: function() {
    term.stylePrint("Easy, killer");
  },

  locate: function() {
    term.stylePrint("Sandip Thapa");
    term.stylePrint("Sitalpani, Bharatpur-23");
    term.stylePrint("Bagmati Province, Nepal");
  },

  history: function() {
    term.history.forEach((element, index) => {
      term.stylePrint(`${1000 + index}  ${element}`);
    })
  },

  find: function(args) {
    const file = args[0];
    if (Object.keys(_FILES).includes(file)) {
      term.stylePrint(_FULL_PATHS[file]);
    } else {
      term.stylePrint(`%find%: ${file}: No such file or directory`);
    }
  },

  fdisk: function() {
    term.command("rm");
  },

  chown: function() {
    term.stylePrint("You do not have permission to %chown%");
  },

  chmod: function() {
    term.stylePrint("You do not have permission to %chmod%");
  },

  mv: function(args) {
    const src = args[0];

    if (_filesHere().includes(src)) {
      term.stylePrint(`You do not have permission to move file ${src}`);
    } else {
      term.stylePrint(`%mv%: ${src}: No such file or directory`);
    }
  },

  cp: function(args) {
    const src = args[0];

    if (_filesHere().includes(src)) {
      term.stylePrint(`You do not have permission to copy file ${src}`);
    } else {
      term.stylePrint(`%cp%: ${src}: No such file or directory`);
    }
  },

  touch: function() {
    term.stylePrint("You can't %touch% this");
  },

  sudo: function(args) {
    if (term.user == "root") {
      term.command(args.join(" "));
    }
    else {
      term.stylePrint(`${colorText(term.user, "user")} is not in the sudoers file. This incident will be reported`);
    }
  },

  su: function(args) {
    user = args[0] || "root";

    if (user == "root" || user == "guest") {
      term.user = user;
      term.command("cd ~");
    } else {
      term.stylePrint("su: Sorry");
    }
  },

  quit: function() {
    term.command("exit");
  },

  stop: function() {
    term.command("exit");
  },

  whoami: function() {
    term.stylePrint(term.user);
  },

  passwd: function() {
    term.stylePrint("Wow. Maybe don't enter your password into a sketchy web-based term.command prompt?");
  },

  ping: function() {
    term.stylePrint("pong");
  },

  ps: function() {
    term.stylePrint("PID TTY       TIME CMD");
    term.stylePrint("424 ttys00 0:00.33 %-zsh%");
    term.stylePrint("158 ttys01 0:09.70 %/bin/npm start%");
    term.stylePrint("767 ttys02 0:00.02 %/bin/sh%");
    term.stylePrint("337 ttys03 0:13.37 %/bin/cgminer -o pwn.d%");
  },

  uname: function(args) {
    switch(args[0]) {
      case "-a":
        term.stylePrint("Ner0PC Ner0pc 0.0.1 Ner0PC Kernel Version 0.0.1 Ner0:xnu-31415.926.5~3/RELEASE_X86_64 x86_64");
        break;
      case "-mrs":
        term.stylePrint("Ner0PC 0.0.1 x86_64");
        break;
      default:
        term.stylePrint("Ner0PC");
    }
  },

  top: function() {
    term.command("ps");
  },

  // exit: function() {
  //   term.command("open welcome.htm");
  // },

  clear: function() {
    term.init();
  },
  
  clr:function(){
    term.init();
  },
  

  zed: function() {
    term.stylePrint("Coming soon! ;)");
  },

  ge: function() {
    term.command("great_expectations");
  },

  great_expectations: function() {
    term.command("superconductive");
  },

  privacy: function() {
    term.command("privacy_dynamics");
  },

  ln: function() {
    term.command("alan");
  },

  anycloud: function() {
    term.stylePrint("https://docs.anycloudapp.com/documentation/tutorials/aws-node");
  },

  eval: function(args) {
    term.stylePrint("please instead build a webstore with macros. in the meantime, the result is: " + eval(args.join(" ")));
  },
  projects: function(){
    repos.forEach(function turi(kv){
      // console.log(kv.name)
      
      term.stylePrint(`${kv.name.toUpperCase().padEnd(20)}${kv.html_url}`)
      term.writeln("")
        // term.stylePrint(desc);
      })
      term.stylePrint("PLACES SHARING APP".padEnd(20)+"https://goodtoseeyou.web.app/")
    // github_project()
    // sleep(2000)
  },
  education:function(){
    education.forEach((element)=>{
      term.writeln("")  
      term.stylePrint(`${element.date.padEnd(10)}${element.type}`)
      term.stylePrint(element.school)
      
    })
  },
  skills:function(){
    skills.forEach((element)=>{
      term.stylePrint(element)
    })
  },
  licenses:function(){
    licenses.forEach((element)=>{
      term.writeln("")  
      term.stylePrint(`${element.name.padEnd(25)}${element.issue}`)
      term.stylePrint(`Credential ID${element.credential.padStart(15)}`)
    })
  },
  experiences:function(){
    experiences.forEach((element)=>{
      term.writeln("")
      term.stylePrint(element)
    })
  }

}

// Add commands for company demos
// for (kv of Object.entries(portfolio)) {
//   const key = kv[0];
//   const val = kv[1];

//   if (val["demo"]) {
//     commands[key] = () => term.displayURL(val["demo"]);
//   }
// }

// function _filesHere() {
//   return _DIRS[term.cwd].filter((e) => e != 'README.md' || term.user == "root" );
// }
