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
	"sort"
)

var products []Product = []Product{}
var offers []Offer = []Offer{}

type Categories struct {
	Category1Values []string `json:"category1values"`
	Category2Values []string `json:"category2values"`
	Category3Values []string `json:"category3values"`
	Brands          []string `json:"brands"`
	Prices          []string `json:"prices"`
	Sizes           []string `json:"sizes"`
	CombTypes       []string `json:"combTypes"`
	DemandIds       []string `json:"demandIds"`
	DemandCounts    []string `json:"demandCounts"`
	BenefitIds      []string `json:"benefitIds"`
	Discounts       []string `json:"discounts"`
	CombMaxs        []string `json:"combMaxs"`
}

type Offer struct {
	Id             string `json:"id"`
	Name           string `json:"name"`
	CombType       string `json:"combType"`
	DemandId       string `json:"demandId"`
	DemandCount    string `json:"demandCount"`
	BenefitId      string `json:"benefitId"`
	Discount       string `json:"discount"`
	CombMax        string `json:"combMax"`
	ValidFrom      time.Time `json:"validFrom"`
	ValidTo        time.Time `json:"validTo"`
	Suspended      bool `json:"suspended"`
	CombCardPrefix string `json:"combCardPrefix"`
	CombStacking   bool `json:"combStacking"`
	CombExternalId string `json:"combExternalId"`
}

type Product struct {
	Id           string `json:"id"`
	Name         string `json:"name"`
	Category1    string `json:"category1"`
	Category2    string `json:"category2"`
	Category3    string `json:"category3"`
	Price        string `json:"price"`
	Size         string `json:"size"`
	Brand        string `json:"brand"`
	Offer        *Offer `json:"offer"`
	OfferId      string `json:"offerId"`
	OfferName    string `json:"offerName"`
	ActivatedPim bool `json:"activatedPim"`
	PictureUrl   string `json:"pictureUrl"`
	Description  string `json:"description"`
}



type ProductById []Product
func (a ProductById) Len() int           { return len(a) }
func (a ProductById) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ProductById) Less(i, j int) bool { return a[i].Id < a[j].Id }

type OfferById []Offer
func (a OfferById) Len() int           { return len(a) }
func (a OfferById) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a OfferById) Less(i, j int) bool { return a[i].Id < a[j].Id }

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

func collectionsAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	if r.Method == "GET" {
		result1 := map[string]struct{}{}
		result2 := map[string]struct{}{}
		result3 := map[string]struct{}{}
		result4 := map[string]struct{}{}
		result5 := map[string]struct{}{}
		result6 := map[string]struct{}{}
		result7 := map[string]struct{}{}
		result8 := map[string]struct{}{}
		result9 := map[string]struct{}{}
		result10 := map[string]struct{}{}
		result11 := map[string]struct{}{}
		result12 := map[string]struct{}{}

		for _, p := range products {
			result1[p.Category1] = struct{}{}
			result2[p.Category2] = struct{}{}
			result3[p.Category3] = struct{}{}
			result4[p.Brand] = struct{}{}
			result5[p.Price] = struct{}{}
			result6[p.Size] = struct{}{}

		}
		for _, o := range offers {
			result7[o.CombType] = struct{}{}
			result8[o.DemandId] = struct{}{}
			result9[o.DemandCount] = struct{}{}
			result10[o.BenefitId] = struct{}{}
			result11[o.Discount] = struct{}{}
			result12[o.CombMax] = struct{}{}
		}

		output1 := []string{}
		output2 := []string{}
		output3 := []string{}
		output4 := []string{}
		output5 := []string{}
		output6 := []string{}
		output7 := []string{}
		output8 := []string{}
		output9 := []string{}
		output10 := []string{}
		output11 := []string{}
		output12 := []string{}

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
		for k := range result7 {
			output7 = append(output7, k)
		}
		for k := range result8 {
			output8 = append(output8, k)
		}
		for k := range result9 {
			output9 = append(output9, k)
		}
		for k := range result10 {
			output10 = append(output10, k)
		}
		for k := range result11 {
			output11 = append(output11, k)
		}
		for k := range result12 {
			output12 = append(output12, k)
		}

		out, _ := json.Marshal(Categories{
			Category1Values: output1,
			Category2Values: output2,
			Category3Values: output3,
			Brands: output4,
			Prices: output5,
			Sizes: output6,
			CombTypes: output7,
			DemandIds: output8,
			DemandCounts: output9,
			BenefitIds: output10,
			Discounts: output11,
			CombMaxs: output12,
		})
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
		id := r.URL.Query().Get("id")
		name := r.URL.Query().Get("nameSearch")
		category1 := r.URL.Query().Get("category1")
		category2 := r.URL.Query().Get("category2")
		category3 := r.URL.Query().Get("category3")
		price := r.URL.Query().Get("price")
		brand := r.URL.Query().Get("brand")
		size := r.URL.Query().Get("size")
		activatedPim := r.URL.Query().Get("activatedPim")
		pictureUrl := r.URL.Query().Get("pictureUrlSearch")
		description := r.URL.Query().Get("descriptionSearch")


		offerNameSearch := r.URL.Query().Get("offerNameSearch")
		offerId := r.URL.Query().Get("offerId")
		offerAssigned := r.URL.Query().Get("offerAssigned")


		result := map[string]Product{}
		for _, p := range products {
			result[p.Id] = p
		}

		if (id != "") {
			for i, p := range result {
				if p.Id != id {
					delete(result, i)
				}
			}
		}
		if (name != "") {
			for i, p := range result {
				if !strings.HasPrefix(strings.ToLower(p.Name), strings.ToLower(name)) {
					delete(result, i)
				}
			}
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
		if (price != "") {
			for i, p := range result {
				if p.Price != price {
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
		if (size != "") {
			for i, p := range result {
				if p.Size != size {
					delete(result, i)
				}
			}
		}
		if (activatedPim != "") {
			for i, p := range result {
				if p.ActivatedPim == true && activatedPim == "0" {
					delete(result, i)
				}
				if p.ActivatedPim == false && activatedPim == "1" {
					delete(result, i)
				}
			}
		}
		if (pictureUrl != "") {
			for i, p := range result {
				if !strings.HasPrefix(strings.ToLower(p.PictureUrl), strings.ToLower(pictureUrl)) {
					delete(result, i)
				}
			}
		}
		if (description != "") {
			for i, p := range result {
				if !strings.HasPrefix(strings.ToLower(p.Description), strings.ToLower(description)) {
					delete(result, i)
				}
			}
		}

		if (offerAssigned != "") {
			for i, p := range result {
				if (p.OfferId == "" && offerAssigned == "1") || p.OfferId != "" && offerAssigned == "0" {
					delete(result, i)
				}
			}
		}
		if (offerId != "") {
			for i, p := range result {
				if (p.OfferId != offerId) {
					delete(result, i)
				}
			}
		}
		if (offerNameSearch != "") {
			for i, p := range result {
				if (p.OfferId != "" && !strings.HasPrefix(strings.ToLower(findOfferById(p.OfferId).Name), strings.ToLower(offerNameSearch))) {
					delete(result, i)
				}
			}
		}


		var res []Product
		for _, p := range result {
			// output names instead of ids
			of := findOfferById(p.OfferId)
			if (of != nil) {
				res = append(res, Product{Id: p.Id, Name:p.Name, Brand:p.Brand, Description:p.Description, PictureUrl:p.PictureUrl, Size:p.Size, Price:p.Price, Category1:p.Category1, Category2:p.Category2, Category3:p.Category3, Offer:of, OfferName:of.Name, OfferId:of.Id, ActivatedPim:p.ActivatedPim})
			} else {
				res = append(res, Product{Id: p.Id, Name:p.Name, Brand:p.Brand, Description:p.Description, PictureUrl:p.PictureUrl, Size:p.Size, Price:p.Price, Category1:p.Category1, Category2:p.Category2, Category3:p.Category3, Offer:nil, OfferName: "",OfferId:"", ActivatedPim:p.ActivatedPim})
			}
		}
		sort.Sort(ProductById(res))
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
		if p.OfferName != "" {
			if findOfferByName(p.OfferName) == nil {
				msg := fmt.Sprintf("Unknown Offer Name: %s", p.OfferName)
				http.Error(w, msg, http.StatusConflict)
				log.Println(msg)
				return
			} else {
				p.OfferId = findOfferByName(p.OfferName).Id;
			}
		}
		if p.OfferId != "" {
			if findOfferById(p.OfferId) == nil {
				msg := fmt.Sprintf("Unknown Offer Id: %s", p.OfferId)
				http.Error(w, msg, http.StatusConflict)
				log.Println(msg)
				return
			} else {
				p.OfferId = findOfferById(p.OfferId).Id;
			}
		}


		p.Id = uuid.NewV4().String()
		products = append(products, p)

		if(p.OfferId != "") {
			p.OfferName = findOfferById(p.OfferId).Name
			p.Offer = findOfferById(p.OfferId)
		}
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
		if p.OfferName != "" {
			if findOfferByName(p.OfferName) == nil {
				msg := fmt.Sprintf("Unknown Offer Name: %s", p.OfferName)
				http.Error(w, msg, http.StatusConflict)
				log.Println(msg)
				return
			} else {
				p.OfferId = findOfferByName(p.OfferName).Id;
			}
		}
		if p.OfferId != "" {
			if findOfferById(p.OfferId) == nil {
				msg := fmt.Sprintf("Unknown Offer Id: %s", p.OfferId)
				http.Error(w, msg, http.StatusConflict)
				log.Println(msg)
				return
			} else {
				p.OfferId = findOfferById(p.OfferId).Id;
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
				prod.Size = p.Size
				prod.PictureUrl = p.PictureUrl
				prod.Description = p.Description
				prod.ActivatedPim = p.ActivatedPim
				prod.OfferId = p.OfferId
				products[pindex] = prod // update in original slice

				if(prod.OfferId != "") {
					prod.OfferName = findOfferById(prod.OfferId).Name
					prod.Offer = findOfferById(prod.OfferId)
				}
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
		if (p.OfferId == offerId) {
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

		id := r.URL.Query().Get("id")
		nameSearch := r.URL.Query().Get("nameSearch")
		combType := r.URL.Query().Get("combType")
		demandId := r.URL.Query().Get("demandId")
		combMax := r.URL.Query().Get("combMax")
		validFrom := r.URL.Query().Get("validFrom")
		validTo := r.URL.Query().Get("validTo")
		suspended := r.URL.Query().Get("suspended")

		selectedProduct := r.URL.Query().Get("product")

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

		offerIds := map[string]Offer{}
		offerResult := []Offer{} // map from Id to full object
		for _, p := range result {
			if p.OfferId != "" {
				offerIds[p.OfferId] = *findOfferById(p.OfferId)
			}
		}
		if (offerType == "New") {
			// discard product based results
			offerIds = map[string]Offer{}
		}
		// Add offers which have no products
		if offerType == "New" || offerType == "All" {
			for _, o := range offers {
				if findInProducts(o.Id) == nil {
					offerIds[o.Id] = o
				}
			}
		}

		if (id != "") {
			for i, o := range offerIds {
				if o.Id != id {
					delete(offerIds, i)
				}
			}
		}
		if (nameSearch != "") {
			for i, o := range offerIds {
				if o.Name != nameSearch {
					delete(offerIds, i)
				}
			}
		}
		if (combType != "") {
			for i, o := range offerIds {
				if o.CombType != combType {
					delete(offerIds, i)
				}
			}
		}
		if (demandId != "") {
			for i, o := range offerIds {
				if o.DemandId != demandId {
					delete(offerIds, i)
				}
			}
		}
		if (combMax != "") {
			for i, o := range offerIds {
				if o.CombMax != combMax {
					delete(offerIds, i)
				}
			}
		}
		if (validFrom != "") {
			for i, o := range offerIds {
				parsed, _ := time.Parse(time.RFC3339, validFrom)
				if o.ValidFrom != parsed {
					delete(offerIds, i)
				}
			}
		}
		if (validTo != "") {
			for i, o := range offerIds {
				parsed, _ := time.Parse(time.RFC3339, validTo)
				if o.ValidTo != parsed {
					delete(offerIds, i)
				}
			}
		}
		if (suspended != "") {
			for i, o := range offerIds {
				if (suspended == "1") {
					if o.Suspended != true {
						delete(offerIds, i)
					}
				}
				if (suspended == "0") {
					if o.Suspended != false {
						delete(offerIds, i)
					}
				}
			}
		}

		for i := range offerIds {
			for _, o := range offers {
				if o.Id == i {
					offerResult = append(offerResult, o)
				}
			}
		}

		sort.Sort(OfferById(offerResult))
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
			http.Error(w, msg, http.StatusBadRequest)
			log.Println(msg)
			return
		}
		if o.ValidFrom.IsZero() {
			msg := fmt.Sprintf("Offer ValidFrom Required")
			http.Error(w, msg, http.StatusBadRequest)
			log.Println(msg)
			return
		}
		if o.ValidTo.IsZero() {
			msg := fmt.Sprintf("Offer ValidTo Required")
			http.Error(w, msg, http.StatusBadRequest)
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


