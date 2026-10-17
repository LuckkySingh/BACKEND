from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.db.models import Q
from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    due_at=forms.DateTimeField(
        required=False,
        input_formats=['%Y-%m-%dT%H:%M'],
        widget=forms.DateTimeInput(
            attrs={'type':'datetime-local'},
            format='%Y-%m-%dT%H:%M'
        )
    )

    class Meta:
        model=Task
        fields=['title','due_at']
        widgets={
            'title':forms.TextInput(attrs={'maxlength':200})
        }

def index(request):
    query=request.GET.get('q','').strip()
    status=request.GET.get('status','all')
    tasks=Task.objects.all()

    if query:
        tasks=tasks.filter(title__icontains=query)

    if status=='pending':
        tasks=tasks.filter(completed=False)
    elif status=='completed':
        tasks=tasks.filter(completed=True)
    elif status=='overdue':
        tasks=tasks.filter(
            completed=False,
            due_at__lt=timezone.now()
        )

    total_count=Task.objects.count()
    completed_count=Task.objects.filter(completed=True).count()
    pending_count=Task.objects.filter(completed=False).count()
    overdue_count=Task.objects.filter(
        completed=False,
        due_at__lt=timezone.now()
    ).count()

    context={
        'tasks':tasks,
        'query':query,
        'status':status,
        'total_count':total_count,
        'completed_count':completed_count,
        'pending_count':pending_count,
        'overdue_count':overdue_count,
        'now':timezone.now(),
    }

    return render(request,'todo/index.html',context)

def add_task(request):
    if request.method=='POST':
        form=TaskForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form=TaskForm()

    return render(request,'todo/task_form.html',{'form':form,'page_title':'Add Task'})

def edit_task(request,task_id):
    task=get_object_or_404(Task,id=task_id)

    if request.method=='POST':
        form=TaskForm(request.POST,instance=task)

        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form=TaskForm(instance=task)

    return render(request,'todo/task_form.html',{'form':form,'page_title':'Edit Task'})

@require_POST
def toggle_task(request,task_id):
    task=get_object_or_404(Task,id=task_id)
    task.completed=not task.completed
    task.save(update_fields=['completed'])
    return redirect('index')

@require_POST
def delete_task(request,task_id):
    task=get_object_or_404(Task,id=task_id)
    task.delete()
    return redirect('index')