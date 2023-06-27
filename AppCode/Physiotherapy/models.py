from django.db import models

# Create your models here.

#用户每天的汇总数据
class YC_UserOptDay(models.Model):
    DataID = models.AutoField(primary_key=True)
    OpenID = models.CharField(max_length=32, db_index=True, verbose_name=("用户的标识"))
    TTypeQiangdu = models.IntegerField(db_index=False, default=0,verbose_name=("强度"))
    TTypeShichang = models.IntegerField(db_index=False, default=0, verbose_name=("时长"))
    TTypeCijimoshi = models.IntegerField(db_index=False, default=0, verbose_name=("刺激模式"))
    TTypeCijiboxing = models.IntegerField(db_index=False, default=0, verbose_name=("刺激波形"))
    MoveDate = models.DateField(auto_now_add=True, db_index=True, verbose_name=("数据日期"))
    class Meta:
        verbose_name = "理疗仪每天记录"
        verbose_name_plural = "理疗仪每天记录"
        db_table = "YC_UserOptDay"

    def __str__(self):
        return self.OpenID

class YC_UserOpt(models.Model):
    move_type_choices = ((0, "未知"), (1, "强度"), (2, "时长"),(3,"刺激模式")
                        ,(4, "刺激波形"))
    TType = models.IntegerField(choices=move_type_choices,db_index=True, default=0,verbose_name=("刺激模式"))
    TTime = models.IntegerField(default=0, verbose_name=("时间(s)"))
    TDate = models.DateTimeField(auto_now=True, db_index=True, verbose_name=("使用时间"))
    YCData = models.ForeignKey(to="YC_UserOptDay", to_field="DataID", verbose_name=("数据"))

    class Meta:
        verbose_name = "理疗仪单一刺激记录"
        verbose_name_plural = "理疗仪单一刺激记录"
        db_table = "YC_UserOpt"

    def __str__(self):
        return self.MoveDate.strftime('%Y-%m-%d %H:%M:%S')

class YC_DataList(models.Model):
    OpenID = models.CharField(max_length=32, db_index=True, verbose_name=("用户的标识"))

    TTypeQiangdu = models.IntegerField(db_index=False, default=0,verbose_name=("强度"))
    TTypeShichang = models.IntegerField(db_index=False, default=0, verbose_name=("时长"))
    TTypeCijimoshi = models.IntegerField(db_index=False, default=0, verbose_name=("刺激模式"))
    TTypeCijiboxing = models.IntegerField(db_index=False, default=0, verbose_name=("刺激波形"))

    DataTime = models.DateTimeField(auto_now=True, db_index=True, verbose_name=("时间"))

    class Meta:
        verbose_name = "理疗仪每天记录"
        verbose_name_plural = "理疗仪每天记录"
        db_table = "YC_DataList"

    def __str__(self):
        return self.OpenID