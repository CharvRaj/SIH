import { execSync } from 'child_process';

try {
  const sc = execSync('sc query MongoDB', { encoding: 'utf-8' });
  console.log('MongoDB Service Status:\n', sc);
} catch (e) {
  console.log('MongoDB service not found or not running via sc:', e.message);
}

try {
  const where = execSync('where mongod', { encoding: 'utf-8' });
  console.log('mongod location:', where);
} catch (e) {
  console.log('mongod not in PATH');
}
