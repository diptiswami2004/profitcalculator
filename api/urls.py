from django.urls import path
from . import views

urlpatterns = [
    path("income/", views.add_income),
    path("expense/", views.add_expense),
    path("summary/", views.profit_summary),
]
