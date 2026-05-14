import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.hashers import make_password
import pymongo

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        client = pymongo.MongoClient(settings.DATABASES['default']['CLIENT']['host'])
        db = client[settings.DATABASES['default']['NAME']]

        for collection_name in [
            'octofit_tracker_workout_suggested_for',
            'octofit_tracker_workout',
            'octofit_tracker_leaderboard',
            'octofit_tracker_activity',
            'octofit_tracker_team',
            'octofit_tracker_user',
        ]:
            db[collection_name].drop()

        client.close()
        self.stdout.write('Cleared all collections.')

        today = datetime.date.today()

        client = pymongo.MongoClient(settings.DATABASES['default']['CLIENT']['host'])
        db = client[settings.DATABASES['default']['NAME']]
        password_hash = make_password('password123')
        now = datetime.datetime.utcnow()

        db['octofit_tracker_user'].insert_many([
            {
                'id': 1,
                'password': password_hash,
                'last_login': None,
                'is_superuser': False,
                'username': 'ironman',
                'first_name': 'Tony',
                'last_name': 'Stark',
                'email': 'ironman@marvel.com',
                'is_staff': False,
                'is_active': True,
                'date_joined': now,
            },
            {
                'id': 2,
                'password': password_hash,
                'last_login': None,
                'is_superuser': False,
                'username': 'spiderman',
                'first_name': 'Peter',
                'last_name': 'Parker',
                'email': 'spiderman@marvel.com',
                'is_staff': False,
                'is_active': True,
                'date_joined': now,
            },
            {
                'id': 3,
                'password': password_hash,
                'last_login': None,
                'is_superuser': False,
                'username': 'batman',
                'first_name': 'Bruce',
                'last_name': 'Wayne',
                'email': 'batman@dc.com',
                'is_staff': False,
                'is_active': True,
                'date_joined': now,
            },
            {
                'id': 4,
                'password': password_hash,
                'last_login': None,
                'is_superuser': False,
                'username': 'superman',
                'first_name': 'Clark',
                'last_name': 'Kent',
                'email': 'superman@dc.com',
                'is_staff': False,
                'is_active': True,
                'date_joined': now,
            },
        ])

        Team.objects.create(id=1, name='Marvel')
        Team.objects.create(id=2, name='DC')

        db['octofit_tracker_team'].update_one({'name': 'Marvel'}, {'$set': {'members_id': [1, 2]}})
        db['octofit_tracker_team'].update_one({'name': 'DC'}, {'$set': {'members_id': [3, 4]}})

        db['octofit_tracker_activity'].insert_many([
            {'id': 1, 'user_id': 1, 'activity_type': 'Running', 'duration': 30, 'calories_burned': 300.0, 'date': str(today - datetime.timedelta(days=3))},
            {'id': 2, 'user_id': 2, 'activity_type': 'Cycling', 'duration': 45, 'calories_burned': 450.0, 'date': str(today - datetime.timedelta(days=2))},
            {'id': 3, 'user_id': 3, 'activity_type': 'Swimming', 'duration': 60, 'calories_burned': 600.0, 'date': str(today - datetime.timedelta(days=1))},
            {'id': 4, 'user_id': 4, 'activity_type': 'Yoga', 'duration': 40, 'calories_burned': 200.0, 'date': str(today)},
        ])

        db['octofit_tracker_leaderboard'].insert_many([
            {'id': 1, 'user_id': 1, 'score': 100, 'rank': 1},
            {'id': 2, 'user_id': 4, 'score': 95, 'rank': 2},
            {'id': 3, 'user_id': 3, 'score': 90, 'rank': 3},
            {'id': 4, 'user_id': 2, 'score': 80, 'rank': 4},
        ])

        db['octofit_tracker_workout'].insert_many([
            {'id': 1, 'name': 'Hero HIIT', 'description': 'High intensity interval training for heroes.'},
            {'id': 2, 'name': 'Kryptonian Cardio', 'description': 'Cardio workout for super strength.'},
        ])
        db['octofit_tracker_workout_suggested_for'].insert_many([
            {'id': 1, 'workout_id': 1, 'user_id': 1},
            {'id': 2, 'workout_id': 1, 'user_id': 2},
            {'id': 3, 'workout_id': 2, 'user_id': 3},
            {'id': 4, 'workout_id': 2, 'user_id': 4},
        ])

        client.close()

        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data.'))
