from mongoengine import Document, StringField, FloatField, ListField, URLField

class Hotel(Document):
    name = StringField(required=True, max_length=200)
    location = StringField(required=True, max_length=200)
    price = FloatField(required=True)
    description = StringField(required=True)
    images = ListField(URLField(), default=[])  # Liste d'URLs des images

    meta = {
        'collection': 'hotels'  # Nom de la collection MongoDB
    }

    def __str__(self):
        return self.name
