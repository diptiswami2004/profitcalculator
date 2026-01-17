from django.db import models

class Income(models.Model):
    source = models.CharField(max_length=100)
    amount = models.FloatField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.source


class Expense(models.Model):
    category = models.CharField(max_length=100)
    amount = models.FloatField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.category
