const { spawn } = require('child_process');

function run(command, cwd) {
  const proc = spawn(command, { shell: true, cwd, stdio: 'inherit' });
  proc.on('close', code => {
    if (code !== 0) {
      console.log(`Process exited with code ${code}`);
    }
  });
}

run('npm start', './frontend');
run('node app.js', './backend'); 