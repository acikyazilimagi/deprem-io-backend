# deprem-io-backend

## Nasıl deploy edilir

* Docker dosyasını kullanın
* Env variable olarak MONGOURL kullanın
* Container Portu 8080

## Yardımları listeleme (GET)
istenen yardımları listeler
/yardim 
localhost:8080/yardim?page=1&limit=1

## Yardımiste Ekleme (POST)
Json Yolla
localhost:8080/yardim
* /models/yardimModel.js e bak 
ÖRNEK JSON POSTU
```
{
    "yardimTipi": "Gıda",
    "adSoyad": "John Doe",
    "telefon": "555-555-5555",
    "yedekTelefonlar": ["555-555-5556", "555-555-5557"],
    "email": "johndoe@example.com",
    "adres": "123 Main St",
    "adresTarifi": "2nd floor, apartment 4B",
    "acilDurum": "normal",
    "kisiSayisi": "3",
    "yardimDurumu": "bekleniyor",
    "fizikiDurum": "normal",
    "googleMapLink": "https://maps.google.com/maps?q=123+Main+St",
    "tweetLink": "https://twitter.com/johndoe/status/1234567890",
     "fields-status": "test-status",
     "fields-yenialan": "ekstrabilgi"
   
}
```

## YardımEt ekleme (GET)
insanların sağladığı yardımları listeler
localhost:8080/yardimet

## YardımEt ekleme (POST)
Json Yolla
localhost:8080/yardimet

```
 {
    "yardimTipi": "Yolcu Taşıma",
    "adSoyad": "Jane Doe",
    "telefon": "+1 987 654 3210",
    "sehir": "Istanbul",
    "hedefSehir": "Ankara",
    "aciklama": "Need transportation from Istanbul to Ankara.",
      "fields-status": "test-status",
     "fields-yenialan": "ekstrabilgi",
    "yardimDurumu": "bekleniyor"
}
```

## Fields alanını kullanımı

post olarak fields-{burası aalanı adı}: value şeklinde datayı gönderin onunları fields objesi altında birleştirip db ye kayddedecek

örneğin fiels-yardimalani: "ankara" şu şekilde döner
 ```
fields: {
    yardimalani: "ankara"
}

 ```

## Not
Opsiyonel her türlü yardım isteme ve yardımEt kısmına eklenecek özellikler için
fields alanını kullanın isteidğiniz gibi json objesi post edebilirsiniz 

## Cache i temizleme
/cache/flushall

## cache i görme 

/cache/getstats

## iletisim (POST)

localhost:8080/iletisim
```
{
    "adSoyad": "John Doe",
    "email": "johndoe@example.com",
    "telefon": "+1 123 456 7890",
    "mesaj": "This is a test message."
}
```

## TODO:

* Yeni data eklenince tüm cache i temizliyor onun düzeltilmesi lazım sadece ilgili cache temizlenecek
* İp logging kısmını biri kontrol etsin
* Filter kısmında yazılan queryi isim, adres telefon gibi tüm yerlerde arıyor ama araya boşluk konup birden fazla paramatere yollarsa çalışmaz
* export scriptlerinde fields kısmında bug var ama acil değil kullanılacaksa bakılır şuan çalışıyor 

## Endpoint Listsi

* /yardim (POST/GET)
* /yardimet (POST/GET)
* /ara-yardimet (/GET)
* /ara-yardim (GET)
* /yardim/:id (GET)
* /yardimet/:id (GET)
* /iletisim (POST)  

## Scripts 

* exportYardimEtCsv.js
`node scripts/exportYardimEtCsv.js`
YardimEt datasını csv export eder 

