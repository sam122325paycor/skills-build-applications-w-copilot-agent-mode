from rest_framework import serializers
from django.conf import settings
import pymongo
from .models import User, Team, Activity, Workout, Leaderboard


def get_user_display_name(user):
    full_name = user.get_full_name().strip()
    return full_name or user.username

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        return get_user_display_name(obj)

    class Meta:
        model = User
        exclude = ['password', 'user_permissions', 'groups']

class TeamSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    member_names = serializers.SerializerMethodField()

    def _get_member_ids(self, obj):
        client = pymongo.MongoClient(settings.DATABASES['default']['CLIENT']['host'])
        db = client[settings.DATABASES['default']['NAME']]
        team_document = db['octofit_tracker_team'].find_one({'id': obj.id}, {'_id': 0, 'members_id': 1}) or {}
        client.close()
        return team_document.get('members_id', [])

    def get_members(self, obj):
        return self._get_member_ids(obj)

    def get_member_names(self, obj):
        member_ids = self._get_member_ids(obj)
        users_by_id = {user.id: user for user in User.objects.filter(id__in=member_ids)}
        return [get_user_display_name(users_by_id[member_id]) for member_id in member_ids if member_id in users_by_id]

    class Meta:
        model = Team
        fields = ['id', 'name', 'created_at', 'members', 'member_names']

class ActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return get_user_display_name(obj.user)

    class Meta:
        model = Activity
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    suggested_for_names = serializers.SerializerMethodField()

    def get_suggested_for_names(self, obj):
        return [get_user_display_name(user) for user in obj.suggested_for.all()]

    class Meta:
        model = Workout
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return get_user_display_name(obj.user)

    class Meta:
        model = Leaderboard
        fields = '__all__'
