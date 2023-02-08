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
    "yardimTipi": "İlaç",
    "adSoyad": "John Doe",
    "telefon": "555-555-5555",
    "adres": "123 Main St",
    "adresTarifi": "Apartment 4B",
    "acilDurum": "kritik",
    "fizikiDurum": "Hasar görmüş",
    "tweetLink": "https://twitter.com/example",
    "fields": {
        "field1": "value1",
        "field2": "value2"
    }
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
    "adSoyad": "John Doe",
    "telefon": "1234567890",
    "sehir": "Istanbul",
    "hedefSehir": "Ankara",
    "aciklama": "Need transportation to Ankara",
    "fields": {
        "field1": "value1",
        "field2": "value2"
    }
      }
```

## Not
Opsiyonel her türlü yardım isteme ve yardımEt kısmına eklenecek özellikler için
fields alanını kullanın isteidğiniz gibi json objesi post edebilirsiniz 

## Cache i temizleme
/cache/flushall

## cache i görme 

/cache/getstats


## TODO:

* Yeni data eklenince tüm cache i temizliyor onun düzeltilmesi lazım sadece ilgili cache temizlenecek
* İp logging kısmını biri kontrol etsin
* export scriptlerinde fields kısmında bug var ama acil değil kullanılacaksa bakılır şuan çalışıyor 

## Scripts 

* exportYardimEtCsv.js
`node scripts/exportYardimEtCsv.js`
YardimEt datasını csv export eder 

