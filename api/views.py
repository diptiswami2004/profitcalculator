import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum
from rest_framework.response import Response
from .models import Income, Expense


@csrf_exempt
def add_income(request):
    if request.method == "POST":
        data = json.loads(request.body)
        Income.objects.create(
            source=data.get("source"),
            amount=float(data.get("amount"))
        )
        return JsonResponse({"message": "Income added"})


@csrf_exempt
def add_expense(request):
    if request.method == "POST":
        data = json.loads(request.body)
        Expense.objects.create(
            category=data.get("category"),
            amount=float(data.get("amount"))
        )
        return JsonResponse({"message": "Expense added"})


def profit_summary(request):
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    incomes = Income.objects.all()
    expenses = Expense.objects.all()

    if start_date and end_date:
        incomes = incomes.filter(date__range=[start_date, end_date])
        expenses = expenses.filter(date__range=[start_date, end_date])

    total_income = incomes.aggregate(Sum("amount"))["amount__sum"] or 0
    total_expense = expenses.aggregate(Sum("amount"))["amount__sum"] or 0

    return JsonResponse({
        "total_income": total_income,
        "total_expense": total_expense,
        "profit": total_income - total_expense
    })
