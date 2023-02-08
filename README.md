# deprem-io-backend

## Yardımları listeleme (GET)
/yardim 
localhost:8079/yardim?page=1&limit=1

## Yardım Ekleme (POST)
Json Yolla
localhost:8079/yardim

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
## Cache i temizleme
/cache/flushall

## cache i görme 

/cache/getstats