from rest_framework.test import APITestCase
from django.conf import settings
from django.contrib.auth.hashers import make_password
import datetime
import pymongo
from .models import User, Team, Activity, Workout, Leaderboard

class UserTests(APITestCase):
    def test_create_user(self):
        user = User.objects.create_user(username='testuser', password='testpass')
        self.assertEqual(User.objects.count(), 1)

class TeamTests(APITestCase):
    def test_team_api_includes_member_names_and_created_at(self):
        client = pymongo.MongoClient(settings.DATABASES['default']['CLIENT']['host'])
        db = client[settings.DATABASES['default']['NAME']]

        db['octofit_tracker_team'].drop()
        db['octofit_tracker_user'].drop()
        db['octofit_tracker_user'].insert_one({
            'id': 1,
            'password': make_password('pass'),
            'last_login': None,
            'is_superuser': False,
            'username': 'teamuser',
            'first_name': 'Team',
            'last_name': 'Mate',
            'email': 'team@example.com',
            'is_staff': False,
            'is_active': True,
            'date_joined': datetime.datetime.utcnow(),
        })
        db['octofit_tracker_team'].insert_one({
            'id': 1,
            'name': 'Team A',
            'members_id': [1],
            'created_at': datetime.datetime.utcnow(),
        })
        client.close()

        response = self.client.get('/api/teams/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['member_names'], ['Team Mate'])
        self.assertEqual(response.json()[0]['members'], [1])
        self.assertIsNotNone(response.json()[0]['created_at'])

class ActivityTests(APITestCase):
    def test_create_activity(self):
        user = User.objects.create_user(username='activityuser', password='pass')
        activity = Activity.objects.create(user=user, activity_type='run', duration=30, calories_burned=200, date='2024-01-01')
        self.assertEqual(Activity.objects.count(), 1)

    def test_activity_api_includes_user_name(self):
        user = User.objects.create_user(username='activityuser', first_name='Active', last_name='User', password='pass')
        Activity.objects.create(user=user, activity_type='run', duration=30, calories_burned=200, date='2024-01-01')

        response = self.client.get('/api/activities/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['user_name'], 'Active User')

class WorkoutTests(APITestCase):
    def test_create_workout(self):
        workout = Workout.objects.create(name='Pushups', description='Do 20 pushups')
        self.assertEqual(Workout.objects.count(), 1)

    def test_workout_api_includes_suggested_for_names(self):
        user = User.objects.create_user(username='workoutuser', first_name='Workout', last_name='User', password='pass')
        workout = Workout.objects.create(name='Pushups', description='Do 20 pushups')
        workout.suggested_for.add(user)

        response = self.client.get('/api/workouts/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['suggested_for_names'], ['Workout User'])

class LeaderboardTests(APITestCase):
    def test_create_leaderboard(self):
        user = User.objects.create_user(username='leaderuser', password='pass')
        leaderboard = Leaderboard.objects.create(user=user, score=100, rank=1)
        self.assertEqual(Leaderboard.objects.count(), 1)

    def test_leaderboard_api_includes_user_name(self):
        user = User.objects.create_user(username='leaderuser', first_name='Leader', last_name='User', password='pass')
        Leaderboard.objects.create(user=user, score=100, rank=1)

        response = self.client.get('/api/leaderboard/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['user_name'], 'Leader User')
