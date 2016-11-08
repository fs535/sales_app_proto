package main

import (
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"io/ioutil"
	"github.com/satori/go.uuid"
	"strings"
	"time"
)

var products []Product = []Product{}
var offers []Offer = []Offer{}

type Categories struct {
	Category1Values []string `json:"category1values"`
	Category2Values []string `json:"category2values"`
	Category3Values []string `json:"category3values"`
	Brands []string `json:"brands"`
	Prices []string `json:"prices"`
	Sizes []string `json:"sizes"`
}

type Offer struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	CombType string `json:"combType"`
	DemandId string `json:"demandId"`
	DemandCount string `json:"demandCount"`
	BenefitId string `json:"benefitId"`
	Discount string `json:"discount"`
	CombMax string `json:"combMax"`
	ValidFrom time.Time `json:"validFrom"`
	ValidTo time.Time `json:"validTo"`
	Suspended bool `json:"suspended"`
	CombCardPrefix string `json:"combCardPrefix"`
	CombStacking bool `json:"combStacking"`
	CombExternalId string `json:"combExternalId"`
}

type Product struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Category1 string `json:"category1"`
	Category2 string `json:"category2"`
	Category3 string `json:"category3"`
	Price    string `json:"price"`
	Size    string `json:"size"`
	Brand   string `json:"brand"`
	Offer    string `json:"offer"`
	OfferId    string `json:"offerId"`
	ActivatedPim   bool `json:"activatedPim"`
	PictureUrl   string `json:"pictureUrl"`
	Description  string `json:"description"`
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
		result1 := map[string]struct{}{}
		result2 := map[string]struct{}{}
		result3 := map[string]struct{}{}
		result4 := map[string]struct{}{}
		result5 := map[string]struct{}{}
		result6 := map[string]struct{}{}

		for _, p := range products {
			result1[p.Category1] = struct{}{}
			result2[p.Category2] = struct{}{}
			result3[p.Category3] = struct{}{}
			result4[p.Brand] = struct{}{}
			result5[p.Price] = struct{}{}
			result6[p.Size] = struct{}{}
		}
		output1 := []string{}
		output2 := []string{}
		output3 := []string{}
		output4 := []string{}
		output5 := []string{}
		output6 := []string{}

		for k := range result1 {
			output1 = append(output1, k)
		}
		for k := range result2 {
			output2 = append(output2, k)
		}
		for k := range result3 {
			output3 = append(output3, k)
		}
		for k := range result4 {
			output4 = append(output4, k)
		}
		for k := range result5 {
			output5 = append(output5, k)
		}
		for k := range result6 {
			output6 = append(output6, k)
		}

		out, _ := json.Marshal(Categories{
			Category1Values: output1,
			Category2Values: output2,
			Category3Values: output3,
			Brands: output4,
			Prices: output5,
			Sizes: output6})
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
		category2 := r.URL.Query().Get("category2")
		category3 := r.URL.Query().Get("category3")
		brand := r.URL.Query().Get("brand")
		price := r.URL.Query().Get("price")
		size := r.URL.Query().Get("size")

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
		if (category2 != "") {
			for i, p := range result {
				if p.Category2 != category2 {
					delete(result, i)
				}
			}
		}
		if (category3 != "") {
			for i, p := range result {
				if p.Category3 != category3 {
					delete(result, i)
				}
			}
		}
		if (brand != "") {
			for i, p := range result {
				if p.Brand != brand {
					delete(result, i)
				}
			}
		}
		if (price != "") {
			for i, p := range result {
				if p.Price != price {
					delete(result, i)
				}
			}
		}
		if (size != "") {
			for i, p := range result {
				if p.Size != size {
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
					!strings.HasPrefix(strings.ToLower(p.Size), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.OfferId), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.PictureUrl), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Description), strings.ToLower(text)) &&
					!strings.HasPrefix(strings.ToLower(p.Brand), strings.ToLower(text))) {
					delete(result, i)
				}
			}
		}

		var res []Product
		for _, p := range result {
			// output names instead of ids
			of := findOfferById(p.Offer)
			if (of != nil) {
				res = append(res, Product{Id: p.Id, Name:p.Name, Brand:p.Brand, Description:p.Description, PictureUrl:p.PictureUrl, Size:p.Size, Price:p.Price, Category1:p.Category1, Category2:p.Category2, Category3:p.Category3, Offer:of.Name, OfferId:of.Id, ActivatedPim:p.ActivatedPim})
			} else {
				res = append(res, Product{Id: p.Id, Name:p.Name, Brand:p.Brand, Description:p.Description, PictureUrl:p.PictureUrl, Size:p.Size, Price:p.Price, Category1:p.Category1, Category2:p.Category2, Category3:p.Category3, Offer:"", OfferId:"", ActivatedPim:p.ActivatedPim})
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
				prod.Brand = p.Brand
				prod.PictureUrl = p.PictureUrl
				prod.Description = p.Description
				prod.ActivatedPim = p.ActivatedPim
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
		offerType := r.URL.Query().Get("type")
		category1 := r.URL.Query().Get("category1")
		category2 := r.URL.Query().Get("category2")
		category3 := r.URL.Query().Get("category3")
		brand := r.URL.Query().Get("brand")
		price := r.URL.Query().Get("price")
		size := r.URL.Query().Get("size")

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
		if (category2 != "") {
			for i, p := range result {
				if p.Category2 != category2 {
					delete(result, i)
				}
			}
		}
		if (category3 != "") {
			for i, p := range result {
				if p.Category3 != category3 {
					delete(result, i)
				}
			}
		}
		if (brand != "") {
			for i, p := range result {
				if p.Brand != brand {
					delete(result, i)
				}
			}
		}
		if (price != "") {
			for i, p := range result {
				if p.Price != price {
					delete(result, i)
				}
			}
		}
		if (size != "") {
			for i, p := range result {
				if p.Size != size {
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
		if(offerType == "New") {
			// discard product based results
			offerIds = map[string]struct{}{}
		}
		// Add offers which have no products
		if offerType == "New" || offerType == "All"   {
			for _, o := range offers {
				if findInProducts(o.Id) == nil {
					offerIds[o.Id] = struct{}{}
				}
			}
		}
		for id := range offerIds {
			for _, o := range offers {
				if o.Id == id {
					if (text != "" && (strings.HasPrefix(strings.ToLower(o.Name), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.Discount), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.CombType), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.DemandCount), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.DemandId), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.BenefitId), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.CombMax), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.ValidFrom.Format(time.RFC3339)), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.ValidTo.Format(time.RFC3339)), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.CombCardPrefix), strings.ToLower(text)) ||
						strings.HasPrefix(strings.ToLower(o.CombExternalId), strings.ToLower(text)) ||
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
				off.CombType = o.CombType
				off.DemandId = o.DemandId
				off.DemandCount = o.DemandCount
				off.BenefitId = o.BenefitId
				off.CombMax = o.CombMax
				off.ValidFrom = o.ValidFrom
				off.ValidTo = o.ValidTo
				off.Suspended = o.Suspended
				off.CombCardPrefix = o.CombCardPrefix
				off.CombStacking = o.CombStacking
				off.CombExternalId = o.CombExternalId
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


