import matplotlib.pyplot as plt

# Data
matrix_dims = [500, 1000, 1500, 2000]

# Speedup values for each number of workers
speedup_2_workers = [1.42, 1.80, 2.01, 2.03]
speedup_4_workers = [1.64, 3.55, 3.78, 3.64]
speedup_8_workers = [2.03, 4.57, 4.58, 4.96]
speedup_16_workers = [1.12, 4.15, 5.84, 6.20]
speedup_rivertrail = [5.54, 45.57, 146.52, 177.64]

include_rivertrail = True

# Create the figure and axis
fig, ax = plt.subplots(figsize=(8, 6))

# Plot the lines
ax.plot(matrix_dims, speedup_2_workers, marker='o', color='blue', label='2 workers')
ax.plot(matrix_dims, speedup_4_workers, marker='o', color='red', label='4 workers')
ax.plot(matrix_dims, speedup_8_workers, marker='o', color='green', label='8 workers')
ax.plot(matrix_dims, speedup_16_workers, marker='o', color='purple', label='16 workers')

if include_rivertrail:
    ax.plot(matrix_dims, speedup_rivertrail, marker='o', color='orange', label='River Trail')

# Add labels and title
ax.set_xlabel('Matrix Dimension')
ax.set_ylabel('Speedup')
if include_rivertrail:
    ax.set_title('Speedup vs. Matrix Dimension for Different Implementations')
else:
    ax.set_title('Speedup vs. Matrix Dimension for Different Number of Workers')

# Add grid and legend
ax.grid(True)
ax.legend()

# Show the plot
plt.tight_layout()
plt.show()
