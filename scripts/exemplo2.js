import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray  } from 'k6/data';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

//performance test
export const options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 }
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    }
}

const data = new SharedArray('Leitura do dados.json', function(){
    return JSON.parse(open('/dados.json')).crocodiles
});
export default function(){
    const crocodile = data[Math.floor(Math.random() * data.length)].id

    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${crocodile}`;
    //console.log(crocodile)
    const res = http.get(BASE_URL);

    check(res, {
        'status code 200': (r) => r.status === 200
    })
}

export function handleSummary(data) {
    return {
      "teste_k6_2.html": htmlReport(data),
    };
  }