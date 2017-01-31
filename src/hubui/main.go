// @APIVersion 1.0.0
// @APITitle Event Processor API
// @APIDescription API for storing events and metrics
// @Contact vladislavs.korehovs@ipr.lv
// @License BSD
// @LicenseUrl http://opensource.org/licenses/BSD-2-Clause
package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"log"
	"github.com/rs/cors"
	"crypto/tls"
	"github.com/GeertJohan/go.rice"
)
// Logger configuration
const (
//	2009/01/23 01:23:23.123123 /a/b/c/d.go:23: message
	Ldate = 1 << iota     // the date in the local time zone: 2009/01/23
	Ltime                         // the time in the local time zone: 01:23:23
	Lmicroseconds                 // microsecond resolution: 01:23:23.123123.  assumes Ltime.
	Llongfile                     // full file name and line number: /a/b/c/d.go:23
	Lshortfile                    // final file name element and line number: d.go:23. overrides Llongfile
	LUTC                          // if Ldate or Ltime is set, use UTC rather than the local time zone
	LstdFlags = Ldate | Ltime // initial values for the standard logger
)

var bindPort int
var bindIP string
var sslCert string
var sslKey string
func init() {
	flag.StringVar(&bindIP, "host", "0.0.0.0", "IP to bind to, by default: 0.0.0.0")
	flag.IntVar(&bindPort, "port", 7777, "Port to bind to, by default: 7777")
	flag.StringVar(&sslCert, "ssl-crt", "", "SSL .crt file")
	flag.StringVar(&sslKey, "ssl-key", "", "SSL .key file")

}

func serveIndex(w http.ResponseWriter, r *http.Request) {
	index, err := rice.MustFindBox("front").String("index.html")
	if(err != nil) {
		http.Error(w, "Failed to find index.html", http.StatusNotFound)
		return;
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(index))
}

func main() {
	flag.Parse()
	log.Println("Args: ", os.Args)
	log.Println("Binding to IP: ", bindIP)
	log.Println("Binding to Port: ", bindPort)

	mux := http.NewServeMux()

	mux.HandleFunc("/productoffers/", serveIndex)
	mux.HandleFunc("/productoffers", serveIndex)
	mux.HandleFunc("/products/", serveIndex)
	mux.HandleFunc("/products", serveIndex)
	mux.HandleFunc("/login/", serveIndex)
	mux.HandleFunc("/login", serveIndex)

	mux.Handle("/", http.FileServer(rice.MustFindBox("front").HTTPBox()))

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowCredentials: true,
	})


	cfg := &tls.Config{
		MinVersion:               tls.VersionTLS12,
		CurvePreferences:         []tls.CurveID{tls.CurveP521, tls.CurveP384, tls.CurveP256},
		PreferServerCipherSuites: true,
		CipherSuites: []uint16{
			tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
			tls.TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,
			tls.TLS_RSA_WITH_AES_256_GCM_SHA384,
			tls.TLS_RSA_WITH_AES_256_CBC_SHA,
		},
	}
	if sslCert != "" && sslKey != "" {
		// HTTP2/SSL
		srv := &http.Server{
			Addr:         fmt.Sprintf("%s:%d", bindIP, bindPort),
			Handler:      c.Handler(mux),
			TLSConfig:    cfg,
			TLSNextProto: make(map[string]func(*http.Server, *tls.Conn, http.Handler), 0),
		}
		err := srv.ListenAndServeTLS(sslCert, sslKey)
		if (err != nil) {
			log.Fatal(err)
		}
	} else {
		// HTTP 1.1
		err := http.ListenAndServe(fmt.Sprintf("%s:%d", bindIP, bindPort), c.Handler(mux))
		if (err != nil) {
			log.Fatal(err)
		}
	}

}
