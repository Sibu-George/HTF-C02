from django.contrib import admin
from django.urls import path
from optimizer import views  # import the app’s views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # root URL goes to home page
]