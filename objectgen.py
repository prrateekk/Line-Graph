import random

def get():
	date = 1
	month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
	f=open("out.txt","w")
	s="["
	v = 20
	l = 0
	h = 5
	for i in range(12):
		for j in range(30):
			if (i==1 and j==30):
				continue
			if (i==11 and j==29):
				v=v+random.randrange(l,5)
				if v<10:
					l=0
					h=5
					v=20
				elif v>90:
					v=90
					l=-5
					h=0
				else:
					l=-3
					h=3
				s+=('{"date":"'+str(j+1)+'-'+str(month[i])+'-10","val":'+str(v)+'}]')
			else:
				v=v+random.randrange(l,5)
				if v<10:
					l=0
					v=10
				elif v>90:
					v=90
					l=-5
					h=0
				else:
					l=-3
					h=3
				s+=('{"date":"'+str(j+1)+'-'+str(month[i])+'-10","val":'+str(v)+'},')
	return s

f=open('file.txt','w')
s=d=b=p=v=0
for states in range(1,5):
	x = random.randrange(2,4)
	s+=1
	for districts in range(1,x):
		y = random.randrange(2,4)
		d+=1
		for blocks in range(1,y):
			z = random.randrange(2,4)
			b+=1
			for panchayats in range(1,z):
				k = random.randrange(2,4)
				p+=1
				for villages in range(1,k):
					v+=1
					f.write('{"country":"India","state":"S'+str(s)+'","district":"D'+str(d)+'","block":"B'+str(b)+'","panchayat":"P'+str(p)+'","village":"V'+str(v)+'",')
					f.write('"data":')
					f.write(get()+'},\n')


f.write('\n')
f.write('//States - '+str(s)+'\n')
f.write('//Districts - '+str(d)+'\n')
f.write('//Blocks - '+str(b)+'\n')
f.write('//Panchayats - '+str(p)+'\n')
f.write('//Villages - '+str(v)+'\n')

f.close()
