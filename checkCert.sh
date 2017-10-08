if true | openssl s_client -connect $1:443 2>/dev/null | openssl x509 -noout -checkend $2; then
  echo "ok"
else
  echo "fail"
fi