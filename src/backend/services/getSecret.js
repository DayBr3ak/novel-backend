export default function getSecret() {
  return process.env.SECRET || "i love pasta";
}
