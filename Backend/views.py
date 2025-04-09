from django.shortcuts import render

def home(request):
    return render(request, 'home.html')  # we’ll create this template next