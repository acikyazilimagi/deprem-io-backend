const telefonKontrol= (telefon) => {
    // Telefon numarası 5 ile başlıyorsa ve 16 karakterden oluşuyorsa true döndürür.
    //Örnek: +90 5xx xxx xx xx
    if(telefon[4] == 5 && telefon.length == 16)
    {
        return true;
    }
    return false;
};
module.exports = telefonKontrol;