import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 10 },    // Normal Load: 10 users
    { duration: '3m', target: 50 },    // Stress Load: increase to 50 users
    { duration: '30s', target: 200 },  // Spike Load: increase to 200 users in 30 seconds
    { duration: '10m', target: 10 },   // Endurance Test: 10 users for 10 minutes
  ],
};

export default function () {
  // ทดสอบ Gateway API ที่รวมข้อมูลจากทั้งสามแหล่ง
  let gatewayRes = http.get('http://localhost:3000/gateway/data');
  check(gatewayRes, {
    'Gateway API responded with status 200': (r) => r.status === 200,
    'Gateway API returned customers data': (r) => JSON.parse(r.body).customers !== undefined,
    'Gateway API returned masterData': (r) => JSON.parse(r.body).masterData !== undefined,
    'Gateway API returned transactions': (r) => JSON.parse(r.body).transactions !== undefined,
  });

  sleep(1);  // รอ 1 วินาทีก่อนคำขอถัดไป เพื่อจำลองการใช้งานที่เป็นจริง
}
