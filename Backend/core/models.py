from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=100)
    project_type = models.CharField(max_length=50)
    size_m2 = models.FloatField()
    budget = models.FloatField()

    def __str__(self):
        return self.name

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    task_type = models.CharField(max_length=50)
    complexity = models.CharField(max_length=20)
    planned_duration = models.IntegerField()
    workforce = models.IntegerField()
    machinery_count = models.IntegerField()
    material_availability = models.CharField(max_length=20)
    weather_impact = models.CharField(max_length=20)
    resource_delivery = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.task_type} ({self.project.name})"
