import { execSync } from 'child_process';

try {
  const out = execSync('net start MongoDB', { encoding: 'utf-8' });
  console.log('Start output:', out);
} catch (e) {
  console.log('Failed to start MongoDB service directly (likely requires admin):', e.message);
}
