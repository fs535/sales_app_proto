package main

import (
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"io/ioutil"
	"github.com/satori/go.uuid"
	"strings"
)

var products []Product = []Product{}
var offers []Offer = []Offer{}

type Offer struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Discount string `json:"discount"`
}

type Product struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Category1 string `json:"category1"`
	Category2 string `json:"category2"`
	Category3 string `json:"category3"`
	Price    string `json:"price"`
	Vendor   string `json:"vendor"`
	Offer    string `json:"offer"`
	OfferId    string `json:"offerId"`
	Active   bool `json:"active"`
}

func loadProducts() {
	if (len(products) == 0) {
		dat, err := ioutil.ReadFile("products.json")
		if (err != nil) {
			msg := fmt.Sprintf("Failed to read products.json: %s", err)
			log.Println(msg)
		}
		err = json.Unmarshal(dat, &products)
		if (err != nil) {
			msg := fmt.Sprintf("Failed to unmarshal products: %s", err)
			log.Println(msg)
		}
	}
}

func loadOffers() {
	if (len(offers) == 0) {
		dat, err := ioutil.ReadFile("offers.json")
		if (err != nil) {
			msg := fmt.Sprintf("Failed to read offers.json: %s", err)
			log.Println(msg)
		}
		err = json.Unmarshal(dat, &offers)
		if (err != nil) {
			msg := fmt.Sprintf("Failed to unmarshal offers: %s", err)
			log.Println(msg)
		}
	}
}

func init() {
	loadProducts()
	loadOffers()
}

func productCategoriesAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	if r.Method == "GET" {
		result := map[string]struct{}{}
		for _, p := range products {
			result[p.Category1] = struct{}{}
		}
		output := []string{}

		for k := range result {
			output = append(output, k)
		}
		out, _ := json.Marshal(output)
		w.Write(out); // write json to the output
	}
}

func findOfferById(offerId string) *Offer {
	for _, o := range offers {
		if (o.Id == offerId) {
			return &o
		}
	}
	return nil
}

func findOfferByName(offerId string) *Offer {
	for _, o := range offers {
		if (o.Name == offerId) {
			return &o
		}
	}
	return nil
}

func productAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	if r.Method == "GET" {
		offer := r.URL.Query().Get("offer")
		category1 := r.URL.Query().Get("category1")
		offered := r.URL.Query().Get("offered")
		text := r.URL.Query().Get("text")

		result := map[string]Product{}
		for _, p := range products {
			result[p.Id] = p
		}

		if (category1 != "") {
			for i, p := range result {
				if p.Category1 != category1 {
					delete(result, i)
				}
			}
		}
		if (offered != "") {
			for i, p := range result {
				if (p.Offer == "" && offered == "1") || p.Offer != "" && offered == "0" {
					delete(result, i)
				}
			}
		}
		if (offer != "") {
			for i, p := range result {
				if (p.Offer != offer) {
					delete(result, i)
				}
			}
		}

		if (text != "") {
			for i, p := range result {
				if (!strings.HasPrefix(strings.ToLower(p.Offer), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Name), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Category1), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Category2), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Category3), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Price), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.OfferId), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Vendor), strings.ToLower(text))) {
					delete(result, i)
				}
			}
		}

		var res []Product
		for _, p := range result {
			// output names instead of ids
			of := findOfferById(p.Offer)
			if (of != nil) {
				res = append(res, Product{Id: p.Id, Name:p.Name, Vendor:p.Vendor, Price:p.Price, Category1:p.Category1, Category2:p.Category2, Category3:p.Category3, Offer:of.Name, OfferId:of.Id, Active:p.Active})
			} else {
				res = append(res, Product{Id: p.Id, Name:p.Name, Vendor:p.Vendor, Price:p.Price, Category1:p.Category1, Category2:p.Category2, Category3:p.Category3, Offer:"", OfferId:"", Active:p.Active})
			}
		}
		output, _ := json.Marshal(res)
		w.Write(output); // write json to the output
	} else if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var p Product
		err := decoder.Decode(&p)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()

		// validations
		if p.Offer != "" {
			if findOfferByName(p.Offer) == nil {
				msg := fmt.Sprintf("Unknown Offer Name: %s", p.Offer)
				http.Error(w, msg, http.StatusConflict)
				log.Println(msg)
				return
			}
		}

		p.Id = uuid.NewV4().String()
		products = append(products, p)

		output, _ := json.Marshal(p)
		w.Write(output);
	} else if r.Method == "PATCH" {
		decoder := json.NewDecoder(r.Body)
		var p Product
		err := decoder.Decode(&p)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()

		// validations
		if p.Offer != "" {
			if findOfferByName(p.Offer) == nil {
				msg := fmt.Sprintf("Unknown Offer Name: %s", p.Offer)
				http.Error(w, msg, http.StatusConflict)
				log.Println(msg)
				return
			}
		}

		for pindex, prod := range products {
			if (prod.Id == p.Id) {
				prod.Name = p.Name
				prod.Category1 = p.Category1
				prod.Category2 = p.Category2
				prod.Category3 = p.Category3
				prod.Price = p.Price
				prod.Vendor = p.Vendor
				prod.Active = p.Active
				off := findOfferByName(p.Offer)
				if (off != nil) {
					prod.Offer = off.Id
					prod.OfferId = off.Id
				} else {
					prod.Offer = ""
					prod.OfferId = ""
				}
				products[pindex] = prod // update in original slice
				output, _ := json.Marshal(prod)
				w.Write(output);
				return
			}
		}
		msg := fmt.Sprintf("Product with ID: %s Not Found", p.Id)
		http.Error(w, msg, http.StatusNotFound)
		log.Println(msg)
	}
}

func findInProducts(offerId string) *Product {
	for _, p := range products {
		if (p.Offer == offerId) {
			return &p
		}
	}
	return nil
}

func offerAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	if r.Method == "GET" {
		category1 := r.URL.Query().Get("category1")
		selectedProduct := r.URL.Query().Get("product")
		text := r.URL.Query().Get("text")

		result := map[string]Product{}
		for _, p := range products {
			result[p.Id] = p
		}

		if (category1 != "") {
			for i, p := range result {
				if p.Category1 != category1 {
					delete(result, i)
				}
			}
		}
		if (selectedProduct != "") {
			for i, p := range result {
				if p.Id != selectedProduct {
					delete(result, i)
				}
			}
		}

		offerIds := map[string]struct{}{}
		offerResult := []Offer{} // map from Id to full object
		for _, p := range result {
			if p.Offer != "" {
				offerIds[p.Offer] = struct{}{}
			}
		}
		for id := range offerIds {
			for _, o := range offers {
				if o.Id == id {
					if (text != "" && (strings.HasPrefix(strings.ToLower(o.Name), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.Discount), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.Id), strings.ToLower(text)))) {
						offerResult = append(offerResult, o)
					} else if(text == "") {
						offerResult = append(offerResult, o)
					}
				}
			}
		}

		output, _ := json.Marshal(offerResult)
		w.Write(output); // write json to the output
	} else if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var o Offer
		err := decoder.Decode(&o)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()

		// validateion
		if o.Name == "" {
			msg := fmt.Sprintf("Offer Name Required")
			http.Error(w, msg, http.StatusNotFound)
			log.Println(msg)
			return
		}

		o.Id = uuid.NewV4().String()
		offers = append(offers, o)

		output, _ := json.Marshal(o)
		w.Write(output);
	} else if r.Method == "PATCH" {
		decoder := json.NewDecoder(r.Body)
		var o Offer
		err := decoder.Decode(&o)
		if err != nil {
			panic(err)
		}
		defer r.Body.Close()

		// validateion
		if o.Name == "" {
			msg := fmt.Sprintf("Offer Name Required")
			http.Error(w, msg, http.StatusNotFound)
			log.Println(msg)
			return
		}

		for offindex, off := range offers {
			if (off.Id == o.Id) {
				off.Name = o.Name
				off.Discount = o.Discount

				offers[offindex] = off // update in original slice
				output, _ := json.Marshal(off)
				w.Write(output);
				return
			}
		}
		msg := fmt.Sprintf("Offer with ID: %s Not Found", o.Id)
		http.Error(w, msg, http.StatusNotFound)
		log.Println(msg)
	}
}

func unassignedOfferAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	if r.Method == "GET" {
		text := r.URL.Query().Get("text")

		offerResult := []Offer{} // map from Id to full object
		for _, o := range offers {
			if findInProducts(o.Id) == nil {
				if (text != "" && (strings.HasPrefix(strings.ToLower(o.Name), strings.ToLower(text)) ||
					strings.HasPrefix(strings.ToLower(o.Discount), strings.ToLower(text)) ||
					strings.HasPrefix(strings.ToLower(o.Id), strings.ToLower(text)))) {
					offerResult = append(offerResult, o)
				} else if(text == "") {
					offerResult = append(offerResult, o)
				}
			}
		}

		output, _ := json.Marshal(offerResult)
		w.Write(output); // write json to the output
	}
}

