# deprem-io-backend



## Yardımları listeleme (GET)
istenen yardımları listeler
/yardim 
localhost:8079/yardim?page=1&limit=1

## Yardımiste Ekleme (POST)
Json Yolla
localhost:8079/yardim
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
localhost:8079/yardimet

## YardımEt ekleme (POST)
Json Yolla
localhost:8079/yardimet

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