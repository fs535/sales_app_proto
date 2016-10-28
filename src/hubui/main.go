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

func init() {
	flag.StringVar(&bindIP, "host", "0.0.0.0", "IP to bind to, by default: 0.0.0.0")
	flag.IntVar(&bindPort, "port", 7777, "Port to bind to, by default: 7777")
}

func main() {
	flag.Parse()
	log.Println("Args: ", os.Args)
	log.Println("Binding to IP: ", bindIP)
	log.Println("Binding to Port: ", bindPort)

	mux := http.NewServeMux()

	mux.HandleFunc("/v1/products/categories", productCategoriesAPIHandler)
	mux.HandleFunc("/v1/products", productAPIHandler)
	mux.HandleFunc("/v1/offers", offerAPIHandler)
	mux.HandleFunc("/v1/offers/unassigned", unassignedOfferAPIHandler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "index.html")
			return;
		}
		f, err := os.Open(r.URL.Path[1:])
		if err != nil {
			http.ServeFile(w, r, "index.html")
			return
		}
		f.Close()
		http.ServeFile(w, r, r.URL.Path[1:])
	})
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowCredentials: true,
	})
	http.ListenAndServe(fmt.Sprintf("%s:%d", bindIP, bindPort), c.Handler(mux))

}
