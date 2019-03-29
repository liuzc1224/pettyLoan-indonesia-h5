import { Environment } from "./environment.model";

export const ENV: Environment = {
  // host: "http://192.168.24.100:9051",
  host: 'http://10.0.52.126:8400',
  // host: 'http://10.0.52.103:8400',
  riskHost: "http://192.168.24.100:9002",
  env: "debug",
  production: false,
  vest: "1",
  client_id: "value_dev",
  secret: "value_dev"
};
