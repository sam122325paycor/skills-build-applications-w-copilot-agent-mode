from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

# Define models for test data population
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        app_label = 'octofit_tracker'

class Activity(models.Model):
    user = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    duration = models.IntegerField()
    team = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'

class Leaderboard(models.Model):
    user = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    points = models.IntegerField()
    class Meta:
        app_label = 'octofit_tracker'

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    suggested_for = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Delete existing data
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        User.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        users = [
            {'username': 'ironman', 'email': 'ironman@marvel.com', 'team': 'Marvel'},
            {'username': 'spiderman', 'email': 'spiderman@marvel.com', 'team': 'Marvel'},
            {'username': 'batman', 'email': 'batman@dc.com', 'team': 'DC'},
            {'username': 'superman', 'email': 'superman@dc.com', 'team': 'DC'},
        ]
        user_objs = []
        for u in users:
            user = User.objects.create_user(username=u['username'], email=u['email'], password='password123')
            user_objs.append(user)

        # Create activities
        Activity.objects.create(user='ironman', type='Running', duration=30, team='Marvel')
        Activity.objects.create(user='spiderman', type='Cycling', duration=45, team='Marvel')
        Activity.objects.create(user='batman', type='Swimming', duration=60, team='DC')
        Activity.objects.create(user='superman', type='Yoga', duration=40, team='DC')

        # Create leaderboard
        Leaderboard.objects.create(user='ironman', team='Marvel', points=100)
        Leaderboard.objects.create(user='spiderman', team='Marvel', points=80)
        Leaderboard.objects.create(user='batman', team='DC', points=90)
        Leaderboard.objects.create(user='superman', team='DC', points=95)

        # Create workouts
        Workout.objects.create(name='Hero HIIT', description='High intensity interval training for heroes.', suggested_for='Marvel')
        Workout.objects.create(name='Kryptonian Cardio', description='Cardio workout for super strength.', suggested_for='DC')

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
