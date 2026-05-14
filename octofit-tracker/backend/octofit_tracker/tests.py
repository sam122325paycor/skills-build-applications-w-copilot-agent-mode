from rest_framework.test import APITestCase
from django.urls import reverse
from .models import User, Team, Activity, Workout, Leaderboard

class UserTests(APITestCase):
    def test_create_user(self):
        user = User.objects.create_user(username='testuser', password='testpass')
        self.assertEqual(User.objects.count(), 1)

class TeamTests(APITestCase):
    def test_create_team(self):
        user = User.objects.create_user(username='teamuser', password='pass')
        team = Team.objects.create(name='Team A')
        team.members.add(user)
        self.assertEqual(team.members.count(), 1)

class ActivityTests(APITestCase):
    def test_create_activity(self):
        user = User.objects.create_user(username='activityuser', password='pass')
        activity = Activity.objects.create(user=user, activity_type='run', duration=30, calories_burned=200, date='2024-01-01')
        self.assertEqual(Activity.objects.count(), 1)

class WorkoutTests(APITestCase):
    def test_create_workout(self):
        workout = Workout.objects.create(name='Pushups', description='Do 20 pushups')
        self.assertEqual(Workout.objects.count(), 1)

class LeaderboardTests(APITestCase):
    def test_create_leaderboard(self):
        user = User.objects.create_user(username='leaderuser', password='pass')
        leaderboard = Leaderboard.objects.create(user=user, score=100, rank=1)
        self.assertEqual(Leaderboard.objects.count(), 1)
